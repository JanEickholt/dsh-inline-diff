/**
 * Host half. Two jobs:
 *
 * 1. Register the durable settings section the client reads/writes.
 * 2. Stamp 1-based `oldStart`/`newStart` onto served diff hunks, so gutters
 *    show real file lines instead of a fresh count from 1.
 *
 * Stock tools serve hunks as bare {path, oldText, newText} tuples with no
 * position info (±3 context lines cut from the full pre/post texts). This
 * half listens on the `tools/execute` waterfall and caches those full texts
 * per path when a settled result matches the `{path, before, after}` triple.
 * Because result views are rebuilt at serve time by calling the registry's
 * live definitions, wrapping the definitions' `presentResult` lets every
 * serve stamp its hunks by locating them verbatim in the cached texts. The
 * search is monotonic and verified; anything ambiguous stays unstamped rather
 * than lying. Stamps ride only the loose view envelope, and unloading restores
 * the original presenters.
 */

import { lstat, readFile, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

import z from "@deepseek-ai/schemastery";

//#region settings schema
// Host alpha renamed the old `settingsNamespace("…")` helper to a plain
// string namespace; the client scope already binds this exact string.
const SETTINGS_NAMESPACE = "inline-diff";

const HIGHLIGHT_FIELD = "highlight";

const INDENT_FIELD = "indent";

const SYNTAX_FIELD = "syntax";

/** Durable schema; also the wire envelope the client scope validates against. */
const HighlightSettingsSchema = z.object({
	[HIGHLIGHT_FIELD]: z.union(["words", "lines"]).default("words"),
	[INDENT_FIELD]: z.union(["strip", "keep"]).default("strip"),
	[SYNTAX_FIELD]: z.union(["on", "off"]).default("on"),
});
//#endregion

//#region diff anchors
/** Path-keyed before/after pairs; oldest dropped past max. */
const ANCHOR_CACHE_MAX = 64;

/** Marker guarding against double-wrapping one definition's presenter. */
const ANCHOR_WRAPPED = Symbol("inline-diff.anchorWrapped");

/** Record one settled `{path, before, after}` outcome for later anchoring. */
function noteAnchorPair(cache, key, before, after) {
	if (typeof key !== "string" || key === "") return;
	if (before !== null && typeof before !== "string") return;
	if (typeof after !== "string") return;
	cache.delete(key);
	cache.set(key, { before, after });
	while (cache.size > ANCHOR_CACHE_MAX) {
		const oldest = cache.keys().next();
		if (oldest.done) break;
		cache.delete(oldest.value);
	}
}

/** Newline-counting scanner locating ordered needles monotonically. */
function makeAnchorScanner(text) {
	if (typeof text !== "string") return null;
	let cursor = 0;
	let linesSeen = 0; // newlines in text[0..cursor)
	const advance = (from, to) => {
		for (let i = from; i < to; i++) {
			if (text.charCodeAt(i) === 10) linesSeen++;
		}
	};
	return function stamp(hunk, field, needle) {
		// Pure insert/delete hunk (empty side): no position.
		if (typeof needle !== "string" || needle === "") {
			hunk[field] = null;
			return;
		}
		// Windows cannot overlap (the producer merges changes sharing <= 3
		// context lines), so the bounded find either hits the true spot or
		// nothing; anything else stays unstamped instead of guessing.
		const at = text.indexOf(needle, Math.min(cursor, text.length));
		if (at < 0) {
			hunk[field] = null;
			return;
		}
		advance(cursor, at);
		hunk[field] = linesSeen + 1;
		cursor = at + needle.length;
		advance(at, cursor); // keep the ledger true across skipped-over lines
	};
}

/**
 * Stamp one ordered hunk list in place, locating hunks that share a path
 * monotonically inside its cached pair. When both sides' texts are known, a
 * hunk only gets mixed stamps if one side is empty (a one-sided change); any
 * other disagreement clears both rather than rendering a half truth.
 * A create (`before === null`) leaves the old side unstamped.
 */
function anchorViewDiffs(cache, diffs) {
	if (!Array.isArray(diffs)) return;
	let activePath = null;
	let entry = null;
	let stampOld = null;
	let stampNew = null;
	for (const hunk of diffs) {
		if (!hunk || typeof hunk.path !== "string") continue;
		if (hunk.path !== activePath) {
			activePath = hunk.path;
			entry = cache.get(activePath) ?? null;
			stampOld = entry && typeof entry.before === "string"
				? makeAnchorScanner(entry.before)
				: null;
			stampNew = entry && typeof entry.after === "string"
				? makeAnchorScanner(entry.after)
				: null;
		}
		if (stampNew === null) continue;
		delete hunk.oldStart;
		delete hunk.newStart;
		stampNew(hunk, "newStart", hunk.newText);
		if (stampOld !== null) {
			stampOld(hunk, "oldStart", hunk.oldText);
		} else if (typeof hunk.oldText === "string" && hunk.oldText !== "") {
			// Both sides carried content but only one located, so refuse the pair.
			delete hunk.newStart;
			continue;
		}
	}
}
//#endregion

//#region presenter wrap
/**
 * Wrap one definition's `presentResult` so every outgoing diff serve gets
 * stamped. Definitions are borrowed registry values, so the swap lands at
 * every consumption site immediately. Returns a restorer.
 */
function wrapPresenter(tools, cache, name) {
	const definition = tools.get(name);
	if (!definition
		|| definition[ANCHOR_WRAPPED] === true
		|| typeof definition.presentResult !== "function"
		|| Object.isFrozen(definition)) {
		return null;
	}
	const original = definition.presentResult.bind(definition);
	definition.presentResult = (args, result) => {
		const view = original(args, result);
		try {
			if (view && view.card === "diff") anchorViewDiffs(cache, view.diffs);
		} catch { /* never break serving */ }
		return view;
	};
	definition[ANCHOR_WRAPPED] = true;
	return () => {
		definition.presentResult = original;
		delete definition[ANCHOR_WRAPPED];
	};
}
//#endregion

//#region fenced read
// Second job: POST /dsh-inline-diff/api/read {cwd, path} answers the client's
// gutter fallback (approach borrowed from dsh-diff-stat) with the CURRENT file
// text, so unstamped hunks can locate themselves and show real line numbers.
// Optional: without a webServer service the client degrades to blank gutters.

const READ_API_PREFIX = "/dsh-inline-diff/api";
const READ_CAP = 512 * 1024;
const BODY_CAP = 4 * 1024 * 1024;

/** Path containment: candidate is root itself or below it (no .. escape). */
function insideFence(root, candidate) {
	const child = relative(root, candidate);
	return child === "" || (!child.startsWith("..") && !isAbsolute(child));
}

/**
 * Resolve a requested path inside the workspace with the full fence: realpath
 * the root, contain the candidate, reject symlinks and non-files, re-contain
 * the resolved path. No bytes are read here.
 */
async function resolveFencedTarget(cwd, requestedPath) {
	if (typeof cwd !== "string" || cwd === "") throw new Error("cwd is required");
	if (typeof requestedPath !== "string" || requestedPath === "") throw new Error("path is required");
	const root = await realpath(cwd);
	const candidate = resolve(root, requestedPath);
	if (!insideFence(root, candidate)) throw new Error("path is outside the session workspace");
	const linkStat = await lstat(candidate);
	if (linkStat.isSymbolicLink()) throw new Error("symbolic links are not supported");
	if (!linkStat.isFile()) throw new Error("path is not a regular file");
	const filename = await realpath(candidate);
	if (!insideFence(root, filename)) throw new Error("resolved path is outside the session workspace");
	return { candidate, filename, size: linkStat.size };
}

/**
 * Read at most READ_CAP of a fenced target, re-verifying path identity around
 * the read (a check-then-use symlink swap would read elsewhere). Returns
 * {kind:"text",content,truncated,size} or {kind:"binary",size}.
 */
async function readFencedText(cwd, requestedPath) {
	const target = await resolveFencedTarget(cwd, requestedPath);
	const assertSame = async () => {
		if ((await realpath(target.candidate)) !== target.filename) {
			throw new Error("file changed while being accessed (link swap)");
		}
	};
	await assertSame();
	let bytes = await readFile(target.filename);
	await assertSame();
	const truncated = target.size > READ_CAP;
	if (truncated) bytes = bytes.subarray(0, READ_CAP);
	if (!truncated && bytes.includes(0)) {
		return { kind: "binary", truncated: false, size: target.size };
	}
	if (truncated) {
		// A raw cap cut can land mid-UTF-8-sequence; walk back over continuation
		// bytes to the lead byte and drop the incomplete tail rather than
		// decoding U+FFFD. Only the truncated head needs this: a whole read of
		// valid UTF-8 always ends on a complete sequence.
		for (let back = 1; back <= 3 && back <= bytes.length; back++) {
			const last = bytes[bytes.length - back];
			if ((last & 0b1100_0000) === 0b1000_0000) continue;
			const need = last >= 0b1111_0000 ? 4 : last >= 0b1110_0000 ? 3 : last >= 0b1100_0000 ? 2 : 1;
			if (need > back) bytes = bytes.subarray(0, bytes.length - back);
			break;
		}
	}
	const text = bytes.toString("utf8");
	// Display layer only: a leading BOM would ride the first diff line.
	return {
		kind: "text",
		content: text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text,
		truncated,
		size: target.size,
	};
}

/** One JSON response, then end. */
function respondJson(res, status, payload) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(payload));
}

/** Read the request body with a hard cap; rejects oversized or non-JSON bodies. */
function readJsonBody(req) {
	return new Promise((resolvePromise, rejectPromise) => {
		const chunks = [];
		let size = 0;
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > BODY_CAP) {
				rejectPromise(new Error("request body too large"));
				req.destroy();
				return;
			}
			chunks.push(chunk);
		});
		req.on("end", () => {
			try {
				const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
				if (parsed === null || typeof parsed !== "object") throw new Error("body must be a JSON object");
				resolvePromise(parsed);
			} catch (error) {
				rejectPromise(error);
			}
		});
		req.on("error", rejectPromise);
	});
}
//#endregion

/**
 * Register the durable inline-diff section when the optional settings service
 * is composed (absent one, the client scope stays on defaults), anchor diff
 * serves when the tools service exists, and serve the fenced read route when
 * the optional webServer exists.
 */
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(SETTINGS_NAMESPACE, HighlightSettingsSchema);
	});

	const webServer = ctx.webServer;
	if (webServer !== undefined) {
		ctx.effect(() => webServer.register({
			kind: "prefix",
			path: READ_API_PREFIX,
			handler: async (req, res) => {
				const route = (req.url ?? "/").split("?")[0];
				if (route === READ_API_PREFIX + "/read") {
					if (req.method !== "POST") {
						respondJson(res, 405, { ok: false, error: "POST only" });
						return;
					}
					try {
						const body = await readJsonBody(req);
						respondJson(res, 200, await readFencedText(String(body.cwd ?? ""), String(body.path ?? "")));
					} catch (error) {
						respondJson(res, 200, { kind: "error", error: String(error?.message ?? error) });
					}
					return;
				}
				respondJson(res, 404, { kind: "error", error: "unknown route" });
			},
		}), "inline-diff: fenced read api");
	}

	ctx.inject(["tools"], (toolsCtx) => {
		const cache = new Map();

		// Capture full pre/post texts the moment an edit-style call settles.
		// Gate on result SHAPE, not tool name: any settled result shaped like
		// {path, before, after} feeds the stamps. Failures never affect
		// dispatch.
		try {
			toolsCtx.effect(() => toolsCtx.on("tools/execute", async (exec, next) => {
				const result = await next();
				try {
					const value = result?.value;
					if (result?.isError !== true && value && typeof value === "object"
						&& (value.before === null || typeof value.before === "string")
						&& typeof value.after === "string") {
						noteAnchorPair(cache,
							typeof exec?.arguments?.file_path === "string" ? exec.arguments.file_path : value.path,
							value.before, value.after);
					}
				} catch { /* anchoring never breaks dispatch */ }
				return result;
			}));
		} catch { /* waterfall unavailable: stock behavior stands */ }

		// Wrap the presenters backing the 'edit'/'write' slots now and again
		// whenever the registry changes (re-registration, scoped shadow, HMR).
		// Restorers run with this fiber's disposal.
		toolsCtx.effect(() => {
			const restorers = [];
			const wrapAll = () => {
				for (const name of ["edit", "write"]) {
					try {
						const restore = wrapPresenter(toolsCtx.tools, cache, name);
						if (restore) restorers.push(restore);
					} catch { /* keep going */ }
				}
			};
			wrapAll();
			let unsubscribe;
			try {
				unsubscribe = toolsCtx.on("tools/change", () => { wrapAll(); });
			} catch { /* event unavailable */ }
			return () => {
				if (unsubscribe) {
					try { unsubscribe(); } catch { /* already gone */ }
				}
				for (let index = restorers.length - 1; index >= 0; index--) {
					try { restorers[index](); } catch { /* best effort */ }
				}
			};
		}, "inline-diff: anchor presenters");
	});
}

export { apply };
