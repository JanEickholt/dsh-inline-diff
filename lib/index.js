/**
 * Host half. Two jobs:
 *
 * 1. Register the durable settings section the client reads/writes.
 * 2. Stamp 1-based `oldStart`/`newStart` onto settled diff hunks, so gutters
 *    show real file lines instead of a fresh count from 1.
 *
 * The kernel computes meta.diffs inside `output.presentationMeta(args, value)`
 * once per settled top-level dispatch and persists the return as the block's
 * wire `meta` — the channel the client half reads first. `value` there is the
 * execute outcome itself, carrying the exact before/after texts the hunks were
 * computed from, so wrapping that one hook lets every settled diff stamp its
 * hunks by locating them verbatim in those texts. The search is monotonic and
 * verified; anything ambiguous stays unstamped rather than lying. Stamps ride
 * the loose meta envelope (the kernel snapshots it after the hook returns),
 * and unloading restores the original projections.
 */

import { lstat, open, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

import z from "@deepseek-ai/schemastery";

//#region settings schema
// Host alpha renamed the old `settingsNamespace("…")` helper to a plain
// string namespace; the client scope already binds this exact string. DSH 0.1.7
// kept the string but moved registration: the namespace is now this plugin's
// cordis profile entry id (the `inline-diff` insert in cordis.patch.yml, which
// the client binds unchanged) and the schema is the package's `Config` export.
// Both shapes are therefore built from one field table.
const SETTINGS_NAMESPACE = "inline-diff";

const HIGHLIGHT_FIELD = "highlight";

const INDENT_FIELD = "indent";

const SYNTAX_FIELD = "syntax";

const NUMBERS_FIELD = "numbers";

const WALLPAPER_FIELD = "wallpaper";

const FOLD_FIELD = "fold";

const FOLD_LINES_FIELD = "foldLines";

// DSH 0.1.7 serves configuration forms from the plugin's own `Config` export,
// and only a field marked volatile is editable through one. schemastery grew
// `.volatile()` in 3.18.4; on the 3.18.2 a 0.1.5 client resolves, that Host
// takes the `register` branch below where every field is editable anyway.
const volatileSupported = typeof z.union(["on", "off"]).default("on").volatile === "function";

/** Mark one field live for a 0.1.7+ form; a pass-through on older schemastery. */
const liveField = (field) => (volatileSupported ? field.volatile() : field);

/**
 * The durable section, rebuilt per call so the two exported schemas never share
 * a mutable node. `foldLines`'s default is stated explicitly because
 * schemastery's number formatter ignores positional args; non-number values
 * throw at envelope validation, missing and null resolve to the default, and
 * fractional or out-of-range values pass through to the client-side clamp.
 */
function highlightSettingsFields() {
	return {
		[HIGHLIGHT_FIELD]: liveField(z.union(["words", "lines"]).default("words")),
		[INDENT_FIELD]: liveField(z.union(["strip", "keep"]).default("strip")),
		[SYNTAX_FIELD]: liveField(z.union(["on", "off"]).default("on")),
		[NUMBERS_FIELD]: liveField(z.union(["on", "off"]).default("on")),
		[WALLPAPER_FIELD]: liveField(z.union(["on", "off"]).default("on")),
		[FOLD_FIELD]: liveField(z.union(["on", "off"]).default("off")),
		[FOLD_LINES_FIELD]: liveField(z.number().default(8)),
	};
}

/** Durable schema for DSH 0.1.5 hosts, which register it explicitly. */
const HighlightSettingsSchema = z.object(highlightSettingsFields());

/**
 * Profile-entry schema for DSH 0.1.7+ hosts, which read the package's `Config`
 * export and key the served namespace off the cordis entry id. cordis 4.0.2
 * (a 0.1.5 client) also understands `Config`, but there it describes an entry
 * no profile overrides, so no second copy of the values is ever written.
 */
const Config = z.object(highlightSettingsFields());
//#endregion

//#region diff anchors
/** Marker guarding against double-wrapping one definition's projector. */
const ANCHOR_WRAPPED = Symbol("inline-diff.anchorWrapped");

/** Newline-counting scanner locating ordered needles monotonically. */
function makeAnchorScanner(text) {
	if (typeof text !== "string") return null;
	let cursor = 0;
	let linesSeen = 0; // newlines in text[0..cursor)
	// Hunks are whole lines, so a hit is only trusted at a line start: a
	// raw indexOf also hits the needle's tail of a longer line ("x = 1"
	// inside "max = 1") and would stamp that earlier line. A needle that
	// never starts a line keeps the raw first hit, as before.
	const findFrom = (needle, from) => {
		const first = text.indexOf(needle, from);
		for (let at = first; at >= 0; at = text.indexOf(needle, at + 1)) {
			if (at === 0 || text.charCodeAt(at - 1) === 10) return at;
		}
		return first;
	};
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
		const at = findFrom(needle, Math.min(cursor, text.length));
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

/** Candidate placements tried before {@link placeHunks} gives up. */
const PLACE_BUDGET = 4096;

/**
 * Place every hunk at the one spot its value pair allows. The hunks were
 * computed from exactly these texts, so before = G0 O0 G1 O1 … Gk and
 * after = G0 N0 G1 N1 … Gk share every unchanged gap G. A hunk's text alone
 * can recur earlier in the file (a closing block, a repeated stanza), where
 * a first-hit scan stamps the wrong lines; a placement here is kept only
 * while both texts agree on the gap before it, and accepted only when the
 * tails after the last hunk agree too. Candidates are tried latest first
 * below a hard bound: the gap is shared, so the run both texts share from
 * the previous hunk's end covers the gap plus the hunk's own common head,
 * which puts the true start at or before (run end − common head) — exactly
 * there whenever the hunk changes something inside it. Backtracks over
 * candidates; returns per-hunk [oldOffset, newOffset] pairs, null when no
 * placement exists (another producer's hunks), or undefined when the
 * budget runs out before one is found.
 */
function placeHunks(hunks, before, after) {
	const aligned = (text, at, needle) => (at === 0 || text.charCodeAt(at - 1) === 10)
		&& (at + needle.length === text.length || text.charCodeAt(at + needle.length) === 10);
	// Work is charged against a budget linear in the texts: backtracking
	// re-measures runs, and look-alike-heavy files must not go quadratic.
	let work = 4 * (before.length + after.length) + 65536;
	const sharedRun = (left, leftAt, right, rightAt) => {
		const max = Math.min(left.length - leftAt, right.length - rightAt);
		let run = 0;
		// Native block compares first; the char loop walks only the block
		// that differs.
		while (run + 4096 <= max
			&& left.slice(leftAt + run, leftAt + run + 4096) === right.slice(rightAt + run, rightAt + run + 4096)) {
			run += 4096;
		}
		while (run < max && left.charCodeAt(leftAt + run) === right.charCodeAt(rightAt + run)) run++;
		work -= run;
		return run;
	};
	const sides = hunks.map((hunk) => {
		const oldNeedle = typeof hunk.oldText === "string" ? hunk.oldText : "";
		return [oldNeedle, hunk.newText, sharedRun(oldNeedle, 0, hunk.newText, 0)];
	});
	// One frame per hunk to place: the previous hunk's ends, the run both
	// texts share from there, and the next candidate's upper bound.
	const frameAt = (oldEnd, newEnd, index) => {
		const shared = sharedRun(before, oldEnd, after, newEnd);
		return { oldEnd, newEnd, shared, upto: index < sides.length ? oldEnd + shared - sides[index][2] : 0 };
	};
	const frames = [frameAt(0, 0, 0)];
	const placed = [];
	let budget = PLACE_BUDGET;
	while (frames.length > 0) {
		const frame = frames[frames.length - 1];
		const index = frames.length - 1;
		if (index === hunks.length) {
			const oldRest = before.length - frame.oldEnd;
			const newRest = after.length - frame.newEnd;
			// Past the last hunk only the final newline may differ: hunk text
			// never carries a newline-at-EOF change ("\ No newline" lines).
			if (oldRest === newRest ? oldRest === frame.shared
				: oldRest + newRest === 1 && (oldRest === 1 ? before : after).endsWith("\n")) {
				return placed;
			}
			frames.pop();
			placed.pop();
			continue;
		}
		const [oldNeedle, newNeedle] = sides[index];
		let found = -1;
		for (let at = frame.upto >= frame.oldEnd ? before.lastIndexOf(oldNeedle, frame.upto) : -1;
			at >= frame.oldEnd;
			at = at > 0 ? before.lastIndexOf(oldNeedle, at - 1) : -1) {
			if (--budget < 0 || work < 0) return undefined;
			if (!aligned(before, at, oldNeedle)) continue;
			const newAt = frame.newEnd + (at - frame.oldEnd);
			if (after.startsWith(newNeedle, newAt) && aligned(after, newAt, newNeedle)) {
				found = at;
				break;
			}
		}
		if (found < 0) {
			frames.pop();
			placed.pop();
			continue;
		}
		frame.upto = found - 1;
		const newAt = frame.newEnd + (found - frame.oldEnd);
		placed.push([found, newAt]);
		frames.push(frameAt(found + oldNeedle.length, newAt + newNeedle.length, index + 1));
	}
	return null;
}

/** 1-based line of each ascending offset in `text`. */
function linesAtOffsets(text, offsets) {
	const lines = [];
	let line = 1;
	let cursor = 0;
	for (const offset of offsets) {
		for (let at = text.indexOf("\n", cursor); at >= 0 && at < offset; at = text.indexOf("\n", at + 1)) line++;
		cursor = Math.max(cursor, offset);
		lines.push(line);
	}
	return lines;
}

/**
 * Stamp one hunk list in place against its settled value pair. The pair is
 * the exact basis the hunks were computed from, and hunks arrive in file
 * order: a verified joint placement ({@link placeHunks}) stamps both sides.
 * A list no placement explains (another producer's hunks) falls back to
 * per-side monotonic locate. There, when both sides'
 * texts are known, a hunk only gets mixed stamps if one side is empty (a
 * one-sided change); any other disagreement clears both rather than rendering
 * a half truth — including an old-side locate failure on a hunk with
 * non-empty old text, which also clears the stamped newStart. A create
 * (`before === null`) leaves the old side unstamped.
 */
function anchorHunksToValue(diffs, before, after) {
	if (!Array.isArray(diffs)) return;
	if (typeof before === "string" && typeof after === "string"
		&& diffs.every((hunk) => hunk && typeof hunk.path === "string" && typeof hunk.newText === "string"
			&& (hunk.oldText === null || typeof hunk.oldText === "string"))) {
		const placed = placeHunks(diffs, before, after);
		if (placed === undefined) {
			// Too many look-alike spots to verify one: a first-hit guess is
			// exactly what goes wrong there, so the client's fallback decides.
			for (const hunk of diffs) {
				delete hunk.oldStart;
				delete hunk.newStart;
			}
			return;
		}
		if (placed !== null) {
			const oldLines = linesAtOffsets(before, placed.map((pair) => pair[0]));
			const newLines = linesAtOffsets(after, placed.map((pair) => pair[1]));
			diffs.forEach((hunk, index) => {
				// An empty side has no line of its own to name.
				hunk.oldStart = typeof hunk.oldText === "string" && hunk.oldText !== "" ? oldLines[index] : null;
				hunk.newStart = hunk.newText !== "" ? newLines[index] : null;
			});
			return;
		}
	}
	const stampNew = makeAnchorScanner(after);
	if (stampNew === null) return;
	const stampOld = typeof before === "string" ? makeAnchorScanner(before) : null;
	for (const hunk of diffs) {
		if (!hunk || typeof hunk.path !== "string") continue;
		delete hunk.oldStart;
		delete hunk.newStart;
		stampNew(hunk, "newStart", hunk.newText);
		if (stampOld !== null) {
			stampOld(hunk, "oldStart", hunk.oldText);
			if (hunk.oldStart === null && typeof hunk.oldText === "string" && hunk.oldText !== "") {
				// Old side carried content but did not locate: refuse the pair
				// instead of leaving a stamped newStart next to a blank old side.
				delete hunk.newStart;
			}
		} else if (typeof hunk.oldText === "string" && hunk.oldText !== "") {
			// Both sides carried content but only one located, so refuse the pair.
			delete hunk.newStart;
		}
	}
}
//#endregion

//#region presentationMeta wrap
/**
 * Wrap one definition's `output.presentationMeta` so every settled diff
 * stamps its hunks with the position they really occupy. The kernel calls
 * the projector once per settled top-level dispatch and persists the return
 * as the block's wire `meta`, so stamps land on the record the client half
 * reads first — not on a re-served view. Definitions are borrowed registry
 * values, so the swap lands at every consumption site immediately. Returns
 * a restorer.
 */
function anchorDefinition(definition) {
	const output = definition && definition.output;
	if (!definition
		|| definition[ANCHOR_WRAPPED] === true
		|| !output
		|| typeof output.presentationMeta !== "function"
		|| Object.isFrozen(definition)
		|| Object.isFrozen(output)) {
		return null;
	}
	// Kept unbound: the projector runs with whatever receiver the kernel
	// calls it on (the `output` object), and the restorer must put back
	// the very function it found, not a bound copy.
	const original = output.presentationMeta;
	output.presentationMeta = function (args, value) {
		const meta = original.call(this, args, value);
		try {
			if (meta && typeof meta === "object"
				&& value && typeof value === "object"
				&& typeof value.after === "string") {
				anchorHunksToValue(meta.diffs, value.before, value.after);
			}
		} catch { /* never break serving */ }
		return meta;
	};
	definition[ANCHOR_WRAPPED] = true;
	return () => {
		output.presentationMeta = original;
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
	// Only the capped head is ever served, so only it is read: a whole-file
	// read buffered a multi-gigabyte file to answer with its first 512 KiB.
	const truncated = target.size > READ_CAP;
	const buffer = Buffer.alloc(Math.min(target.size, READ_CAP));
	let filled = 0;
	const handle = await open(target.filename, "r");
	try {
		while (filled < buffer.length) {
			const { bytesRead } = await handle.read(buffer, filled, buffer.length - filled, filled);
			if (bytesRead === 0) break;
			filled += bytesRead;
		}
	} finally {
		await handle.close();
	}
	await assertSame();
	let bytes = buffer.subarray(0, filled);
	// NUL check runs on the capped head too: a large binary must not slip
	// through as truncated text garbage.
	if (bytes.includes(0)) {
		return { kind: "binary", truncated, size: target.size };
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

/**
 * The route serves file text from a client-chosen cwd, so it must refuse
 * every request the host's own /api would: a plugin route on `webServer`
 * gets no fence of its own, and without one a DNS-rebound page (Host names
 * the attacker's domain) or any network peer of a non-loopback bind could
 * read arbitrary files. The `connection` service (0.2.x) owns that fence —
 * Host/Origin checks plus the login cookie. A host without it gets the
 * Host/Origin half here: a loopback Host (the one header rebinding cannot
 * forge), no cross-site fetch metadata, and a same-authority Origin.
 */
function localRequestRejection(req) {
	const headers = (req && req.headers) || {};
	let hostUrl;
	try {
		hostUrl = new URL("http://" + (typeof headers.host === "string" ? headers.host : ""));
	} catch {
		return 403;
	}
	const name = hostUrl.hostname;
	const loopback = name === "localhost" || name === "[::1]"
		|| /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(name);
	if (!loopback || headers["sec-fetch-site"] === "cross-site") return 403;
	if (typeof headers.origin === "string") {
		try {
			if (new URL(headers.origin).host !== hostUrl.host) return 403;
		} catch {
			return 403;
		}
	}
	return undefined;
}
//#endregion

/**
 * Register the durable inline-diff section when the optional settings service
 * is composed, stamp diff meta when the tools service exists, and serve the
 * fenced read route when the optional webServer exists.
 *
 * DSH 0.1.7 replaced the settings namespace registry with a form projection
 * over the plugin's own `Config` export: `settings.register` is gone and
 * `settings.configure` only claims the automatically generated page. The
 * service is the same name on both lines, so the branch is on the method.
 */
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		const settings = settingsCtx.settings;
		if (typeof settings.register === "function") {
			settings.register(SETTINGS_NAMESPACE, HighlightSettingsSchema);
			return;
		}
		if (typeof settings.configure === "function") {
			// `auto: false`: this plugin ships its own Plugins-settings card, so
			// the Host must not also generate a page for the same entry. The
			// policy belongs to THIS plugin fiber, not the settings-inject child.
			settingsCtx.effect(
				() => settings.configure({ auto: false }, ctx.fiber),
				"inline-diff: settings page policy",
			);
		}
	});

	// Optional: tracked separately so a host without it still serves the
	// route behind the local fence instead of dropping the gutter fallback.
	let connection = null;
	ctx.inject(["connection"], (connectionCtx) => {
		connectionCtx.effect(() => {
			connection = connectionCtx.connection;
			return () => { connection = null; };
		}, "inline-diff: read route trust fence");
	});
	const requestRejection = (req) => {
		if (connection !== null && typeof connection.requestRejection === "function") {
			try {
				return connection.requestRejection(req);
			} catch {
				return 403;
			}
		}
		return localRequestRejection(req);
	};

	ctx.inject(["webServer"], (webCtx) => {
		const webServer = webCtx.webServer;
		ctx.effect(() => webServer.register({
			kind: "prefix",
			path: READ_API_PREFIX,
			handler: async (req, res) => {
				const rejection = requestRejection(req);
				if (rejection !== undefined) {
					respondJson(res, rejection, { kind: "error", error: "request refused" });
					return;
				}
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
	});

	ctx.inject(["tools"], (toolsCtx) => {
		// Preset tools mount per agent scope, so the registry's global
		// `get("edit")` usually reads absent and a registration-time hook
		// misses agents mounted before this plugin applied. The dispatch gate
		// dominates: every execution resolves its definition through
		// createSuccessResult, so wrapping there reaches any edit/write
		// definition on its first settled dispatch, whenever it mounted.
		toolsCtx.effect(() => {
			const registry = toolsCtx.tools;
			const restorers = [];
			const tryWrap = (definition) => {
				try {
					if (definition && typeof definition === "object"
						&& (definition.name === "edit" || definition.name === "write")
						&& definition[ANCHOR_WRAPPED] !== true) {
						const restore = anchorDefinition(definition);
						if (restore) restorers.push(restore);
					}
				} catch { /* keep going */ }
			};
			for (const name of ["edit", "write"]) {
				try { tryWrap(registry.get(name)); } catch { /* keep going */ }
			}
			const proto = Object.getPrototypeOf(registry);
			let originalCreate = null;
			try {
				if (proto && typeof proto.createSuccessResult === "function") {
					originalCreate = proto.createSuccessResult;
					proto.createSuccessResult = function (exec, tool, candidate) {
						try { tryWrap(tool); } catch { /* keep going */ }
						return originalCreate.call(this, exec, tool, candidate);
					};
				}
			} catch { /* keep going */ }
			return () => {
				if (originalCreate !== null) {
					try { proto.createSuccessResult = originalCreate; } catch { /* best effort */ }
				}
				for (let index = restorers.length - 1; index >= 0; index--) {
					try { restorers[index](); } catch { /* best effort */ }
				}
			};
		}, "inline-diff: anchor presentationMeta");
	});
}

export { Config, apply };
