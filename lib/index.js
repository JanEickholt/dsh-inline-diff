/**
 * Host half. Two jobs:
 *
 * 1. Register the durable settings section the client reads/writes.
 * 2. Stamp 1-based `oldStart`/`newStart` onto the hunks of edit/write diff
 *    cards, so gutters show real file lines instead of a fresh count from 1.
 *
 * How anchoring works. Stock tools carry no position info: their served
 * hunks are `{path, oldText, newText}` tuples cut (with ±3 context lines)
 * from the full pre/post texts the tool executed against. This half listens
 * on the official `tools/execute` waterfall and caches those full texts per
 * path when a settled result matches the `{path, before, after}` triple.
 * Because result views are rebuilt at serve time by calling the registry's
 * live definitions (`dsh-host-apiproxy` consults `ctx.tools.get(...)`
 * separately for live frames, session.history pages, and replays), wrapping
 * the definitions' `presentResult` lets every serve stamp its hunks by
 * locating them verbatim inside the cached texts — monotonic, verified
 * search; anything ambiguous stays unstamped and renders stock rather than
 * lying. Stamps are additive fields the strict schemas never see (they ride
 * only the loose view envelope), and unloading the plugin restores the
 * original presenters.
 */

import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";

//#region settings schema
/** Settings namespace owned by this plugin. */
const SETTINGS_NAMESPACE = settingsNamespace("inline-diff");

/** Field carrying the intra-line highlight mode. */
const HIGHLIGHT_FIELD = "highlight";

/** Field carrying whether shared leading indentation is stripped. */
const INDENT_FIELD = "indent";

/** Field carrying whether code rows get syntax-token coloring. */
const SYNTAX_FIELD = "syntax";

/** Durable schema; also the wire envelope the client scope validates against. */
const HighlightSettingsSchema = z.object({
	[HIGHLIGHT_FIELD]: z.union(["words", "lines"]).default("words"),
	[INDENT_FIELD]: z.union(["strip", "keep"]).default("strip"),
	[SYNTAX_FIELD]: z.union(["on", "off"]).default("on"),
});
//#endregion

//#region diff anchors
/** Path-keyed before/after pairs kept for view (re)serves; oldest dropped. */
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
		// Empty side (pure insert/delete hunk): honestly unpositionable.
		if (typeof needle !== "string" || needle === "") {
			hunk[field] = null;
			return;
		}
		// Windows cannot overlap (the producer merges changes separated by <=
		// 3 shared context lines), so the bounded find hits the true spot or
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
 * Stamp one ordered hunk list in place. Hunks sharing a path are located
 * monotonically inside its cached pair; when both sides' texts are known,
 * a hunk is only allowed mixed stamps if one side is empty (a one-sided
 * change) — any other disagreement clears both rather than rendering a half
 * truth. A create (`before === null`) leaves the old side unstamped.
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
			// Both sides carried content but only one located — refuse the pair.
			delete hunk.newStart;
			continue;
		}
	}
}
//#endregion

//#region presenter wrap
/**
 * Wrap one definition's `presentResult` so every outgoing diff serve gets
 * stamped. Returns a restorer; definitions are borrowed registry values, so
 * the swap takes effect immediately at every consumption site.
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

/**
 * Register the durable inline-diff section when the optional settings service
 * is composed; absent one, the client scope simply stays on defaults. Anchor
 * diff serves when the tools service exists.
 * @param ctx - host cordis context.
 */
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(SETTINGS_NAMESPACE, HighlightSettingsSchema);
	});

	ctx.inject(["tools"], (toolsCtx) => {
		const cache = new Map();

		// Capture full pre/post texts the moment an edit-style call settles.
		// Gate on result SHAPE, not tool name: any tool answering with the
		// {path, before, after} triple feeds the same stamps. Failures here
		// never affect dispatch.
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
		} catch { /* waterfall unavailable — stock behavior stands */ }

		// Wrap the presenters backing the UI's 'edit'/'write' slots now, and
		// again whenever the registry changes (re-registration, scoped shadow,
		// HMR). Restorers run together with this fiber's disposal.
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
