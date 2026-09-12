// Renders the client half with stubs: apply() onto a fake ctx, render
// InlineDiffRow server-side, assert syntax tokens, word chips and gutters.
import { readFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";

let factory;
globalThis.window = {
	__ModuleLoader__: {
		load(registration) { factory = registration.factory; },
	},
};
globalThis.document = {
	createElement(tag) { return { tag, dataset: {}, style: {}, textContent: "" }; },
	head: { appendChild() {} },
};
Object.defineProperty(globalThis, "navigator", { value: { languages: ["en"] }, configurable: true });

const requireStub = (spec) => {
	if (spec === "react") return React;
	throw new Error("unexpected require " + spec);
};

const source = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");
new Function("window", "require", source)(globalThis.window, requireStub);
const plugin = factory(requireStub);

const effects = [];
const registrars = {};
const fakeCtx = {
	effect(fn) { const d = fn(); effects.push(d); return d; },
	inject() {}, // optional services (locale) — browser seed stands
	slots: {
		inject(name, fn) { (registrars[name] ??= []).push(fn); },
		register(_meta, component) { return component; },
	},
	settingsScope: {
		bind() {
			return {
				getSnapshot: () => ({ status: "ready", writable: true, value: {} }),
				subscribe: () => () => {},
				set: () => ({ catch() {} }),
			};
		},
	},
};
plugin.apply(fakeCtx);

const collect = (name) => {
	const out = [];
	for (const fn of registrars[name]) {
		const result = fn();
		for (const entry of Array.isArray(result) || result?.[Symbol.iterator] ? result : [result]) out.push(entry);
	}
	return out;
};
const InlineDiffRow = collect("tool.call.toolview")[0];
if (typeof InlineDiffRow !== "function") throw new Error("toolview component not resolved");

// Unstamped hunks number window-relatively (dsh-diff-stat's gutter policy):
// the locate fallback runs in a browser effect, but the gutter always
// renders — SSR shows side positions 1..N on both panes.
const unstampedBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "function getLocale() {\n\treturn oldLocale;\n}\n",
			newText: "const getLocale = () => {\n\treturn activeLocale; // keep\n};\n",
		}],
	},
};
const html = renderToString(React.createElement(InlineDiffRow, {
	block: unstampedBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
for (const expected of [1, 2, 3]) {
	const hits = html.split('<span class="did-num">' + expected + "</span>").length - 1;
	if (hits < 2) throw new Error("missing fallback gutter number " + expected + " on both sides");
}
// Unknown bases reserve a 4-digit lane so the late locate re-render cannot
// rewrap the card (a post-paint height shift latches follow-scroll off).
if (!html.includes("--did-num-w:4ch")) throw new Error("unknown-base lane not reserved at 4ch");

// Stamped hunks (host serve-time oldStart/newStart anchors) number every row:
// three modified rows → old 10..12, new 12..14.
const stampedBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "function getLocale() {\n\treturn oldLocale;\n}\n",
			newText: "const getLocale = () => {\n\treturn activeLocale; // keep\n};\n",
			oldStart: 10,
			newStart: 12,
		}],
	},
};
const stampedHtml = renderToString(React.createElement(InlineDiffRow, {
	block: stampedBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
for (const expected of [10, 11, 12, 13, 14]) {
	if (!stampedHtml.includes('<span class="did-num">' + expected + "</span>")) {
		throw new Error("missing gutter number " + expected);
	}
}
// The gutter lane sizes to the card's largest rendered number (min 3ch);
// 14 → 2 digits → clamped to 3ch.
if (!stampedHtml.includes("--did-num-w:3ch")) throw new Error("gutter width var missing");

// Similarity pairing: a comment inserted above an edited line must not steal
// the edit's counterpart (the old run-order pairing chipped the edited line
// against the comment and left the real change a pure addition). The old
// line pairs with the similar new line — chips land on the changed number —
// and the comment stays a pure addition. Stats keep counting full runs.
const pairBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "const attempts = 1;\n",
			newText: "// retried twice\nconst attempts = 2;\n",
		}],
	},
};
const pairHtml = renderToString(React.createElement(InlineDiffRow, {
	block: pairBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
const pairChecks = [
	["edited line pairs across the inserted comment", /did-insword[^>]*>2</.test(pairHtml)],
	["removed chip on the old number", /did-delword[^>]*>1</.test(pairHtml)],
	["stats still count full runs", pairHtml.includes('did-addnum">+2') && pairHtml.includes("did-delnum\">−1")],
	// Row order: the insertion renders above the pair it precedes, so the
	// right column's numbers read 1, 2 instead of 2, 1. The comment line is
	// wholly novel, so run-level chips suppress its chip (tint only) and its
	// text renders unsplit — anchor on the paired row's chip on "2".
	["insertion renders above its pair",
		pairHtml.indexOf("// retried twice") < pairHtml.search(/did-insword[^>]*>2</)],
];

// Containment pairing: a line embedded in a longer counterpart — a call
// wrapped in a spread/conditional — scores too low on symmetric Dice (the
// wrapper tokens dilute it) but must still pair, so the word chips show the
// real change instead of a bare removal next to a bare addition.
const spreadBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "customerPhone: \"0201 555000\",\n",
			newText: "...(options?.withoutPhone ? {} : { customerPhone: \"0201 555000\" }),\n",
		}],
	},
};
const spreadHtml = renderToString(React.createElement(InlineDiffRow, {
	block: spreadBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
pairChecks.push(
	// The removed side is fully contained, so it carries no changed tokens;
	// a chip on the added side only exists once the rows pair as modified.
	["embedded line still pairs", /did-insword/.test(spreadHtml)],
);

// 1:1 stacking: one removed line and one added line always render as a
// single modified row, even when token similarity scores 0 — there is no
// other candidate to mispair against, and a del/add replacement belongs on
// one row. Previously the weak pair stayed one-sided and the replacement
// stacked as a red row above a green row on opposite sides.
const swapBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "const tenantRoles = identityRoles.filter((role) => role !== 'owner');\n",
			newText: "const tenantRoles: readonly string[] = TENANT_ROLES;\n",
		}],
	},
};
const swapHtml = renderToString(React.createElement(InlineDiffRow, {
	block: swapBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
pairChecks.push(
	// One-sided rows fill their counterpart cell with did-void; a modified
	// row renders del/ins cells sharing one data-ri and no void cell.
	["1:1 weak pair stacks as one row", !swapHtml.includes("did-void")],
	["stacked row shares its data-ri", swapHtml.split('data-ri="0"').length - 1 === 2],
);

// Whitespace-only word chips: an indent-only chip paints a full-width bar
// before the text, so whitespace tokens must stay chip-free even when the
// diff marks them changed.
const indentBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "if (ready) {\n\t\tgo();\n}\n",
			newText: "if (ready) {\n\tgo();\n}\n",
		}],
	},
};
const indentHtml = renderToString(React.createElement(InlineDiffRow, {
	block: indentBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
pairChecks.push(
	["indent change keeps row tint", /did-delbg/.test(indentHtml) && /did-insbg/.test(indentHtml)],
	["indent change never chips whitespace", !/(did-delword|did-insword)[^>]*>\s/.test(indentHtml)],
);

// Blank changed lines tint like any other changed row — no ⏎ glyph, no
// transparent-bar special case.
const blankBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "a();\n\nb();\n",
			newText: "a();\nb();\n",
		}],
	},
};
const blankHtml = renderToString(React.createElement(InlineDiffRow, {
	block: blankBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
pairChecks.push(
	["blank changed row keeps tint class", /did-(del|ins)bg/.test(blankHtml)],
	["blank changed row has no enter glyph", !blankHtml.includes("⏎")],
	["blank changed row has no word chip", !/did-(del|ins)bg[^>]*did-(del|ins)word[^>]*>(?:<[^>]+>)*\s*</.test(blankHtml)],
);

// One removal replaced by a multi-line block (the screenshot case): chips
// come from a run-level token diff, so text that survives on a sibling new
// line stays plain and only genuinely novel tokens chip — on both sides.
const blockBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "        return hours.enabled && local.weekday === hours.weekday && local.minute >= hours.openMinute && local.minute < hours.closeMinute;\n",
			newText: "        return (\n            hours.enabled &&\n            local.weekday === hours.weekday &&\n            isMinuteWithinWindows(local.minute, hours.windows)\n        );\n",
		}],
	},
};
const blockHtml = renderToString(React.createElement(InlineDiffRow, {
	block: blockBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
pairChecks.push(
	["novel call chips on the added side", /did-insword[^>]*>isMinuteWithinWindows</.test(blockHtml)],
	["novel paren chips on the added side", /did-insword[^>]*>\(/.test(blockHtml)],
	["survived prefix stays plain on the removed side", !/did-delword[^>]*>return</.test(blockHtml)],
	["survived weekday line stays plain on the added side", !/did-insword[^>]*>weekday</.test(blockHtml)],
	["removed tail still chips", /did-delword[^>]*>closeMinute</.test(blockHtml)],
);

// Merge anchor: a one-line statement folded into a multi-line block contains
// several fragments, so greedy similarity would anchor the pair at the
// highest-scoring fragment — a mid-block continuation — and the red line
// floats inside the green block. The rewrite reads head-first: the removed
// line pairs with the block's first line and the pair leads the run.
const foldBlock = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "lib/client.js",
			oldText: "await expect(load({ locals: { tenant: { id: 'tenant-1' } } } as never)).resolves.toEqual({ catalog: null });\n",
			newText: "await expect(load({ locals: { tenant: { id: 'tenant-1' } }\n} } as never)).resolves.toEqual({\n\tcatalog: null,\n\tstub: false\n});\n",
		}],
	},
};
const foldHtml = renderToString(React.createElement(InlineDiffRow, {
	block: foldBlock, toolName: "edit", cwd: "/w", home: "/h",
}));
pairChecks.push(
	// The left grid renders before the right one, so the first changed cell
	// in the html is the run's first left cell: the modified row's delbg
	// leads, instead of an added row's void cell.
	["folded statement pairs at the block head", foldHtml.indexOf("did-delbg") < foldHtml.indexOf("did-void")],
);

const checks = [
	["hljs keyword span", /<span class="hljs-keyword"/.test(html)],
	["hljs comment span", /hljs-comment/.test(html)],
	["svelte directive keyword", (() => {
		const svelteHtml = renderToString(React.createElement(InlineDiffRow, {
			block: {
				kind: "edit",
				resultView: {
					card: "diff",
					diffs: [{
						path: "routes/+page.svelte",
						oldText: "{#if on}\n\t<p>on</p>\n{/if}\n",
						newText: "{#if off}\n\t<p>off</p>\n{/if}\n",
					}],
				},
			}, toolName: "edit", cwd: "/w", home: "/h",
		}));
		return /hljs-keyword[^<]*>#if</.test(svelteHtml) || /<span class="hljs-keyword">#[^<]*<\/span>/.test(svelteHtml);
	})()],
	["word chip present", /did-insword/.test(html)],
	["chip merged with token class", /class="hljs-keyword did-insword"|class="did-insword hljs-keyword"/.test(html)],
	["row tint present", /did-insbg/.test(html)],
	["fallback numbers without a base", /<span class="did-num">1<\/span>/.test(html)],
	["no sign markers", !/did-sign/.test(html)],
	["file head stats", /did-filehead/.test(html)],
];
let failed = 0;
for (const [name, ok] of [...checks, ...pairChecks]) {
	console.log((ok ? "PASS" : "FAIL") + " " + name);
	if (!ok) failed++;
}
console.log("--- html sample ---");
console.log(html.slice(0, 1000));

// Failed call: the attempted diff stays collapsed behind a clickable
// header carrying the failed badge, with no diff rows rendered.
const failedHtml = renderToString(React.createElement(InlineDiffRow, {
	block: { kind: "edit", isError: true, call: { name: "edit", argsRaw: JSON.stringify({
		file_path: "lib/client.js",
		old_string: "function getLocale() {\n\treturn oldLocale;\n}\n",
		new_string: "const getLocale = () => {\n\treturn activeLocale; // keep\n};\n",
	}) } },
	toolName: "edit", cwd: "/w", home: "/h",
}));
const failedChecks = [
	["failed card collapsed", !/did-grid/.test(failedHtml)],
	["failed badge present", /did-failedbadge/.test(failedHtml) && /failed/.test(failedHtml)],
	["failed head is a toggle", /did-headtoggle/.test(failedHtml) && /aria-expanded="false"/.test(failedHtml)],
	["failed head keeps stats", /did-addnum/.test(failedHtml)],
];
for (const [name, ok] of failedChecks) {
	console.log((ok ? "PASS" : "FAIL") + " " + name);
	if (!ok) failed++;
}

// Whole-file write fallback: the new harness records meta.diffs: [] for a
// created file (before === null), so the card falls back to the
// argument-derived whole-file hunk whose oldText is "" — a null there used
// to crash the hunkKey, abdicating the slot entry and falling every further
// edit/write card back to the stock row.
const writeHtml = renderToString(React.createElement(InlineDiffRow, {
	block: {
		kind: "write",
		isError: false,
		meta: { diffs: [] },
		call: { name: "write", argsRaw: JSON.stringify({
			file_path: "fix-pr-124.py",
			content: "#!/usr/bin/env python3\nprint('hi')\n",
		}) },
	},
	toolName: "write", cwd: "/w", home: "/h",
}));
const writeChecks = [
	["created write renders whole-file card", /did-grid/.test(writeHtml)],
	["created write is all added", /did-insbg/.test(writeHtml) && !/did-delbg/.test(writeHtml)],
];
for (const [name, ok] of writeChecks) {
	console.log((ok ? "PASS" : "FAIL") + " " + name);
	if (!ok) failed++;
}

// Settings card smoke: renders its header with the updated description.
const DiffHighlightCard = collect("settings.plugin.item")[0];
if (typeof DiffHighlightCard !== "function") throw new Error("card component not resolved");
const cardHtml = renderToString(React.createElement(DiffHighlightCard, {}));
console.log((/Syntax, diff highlighting/.test(cardHtml) ? "PASS" : "FAIL") + " card description");
if (!/Syntax, diff highlighting/.test(cardHtml)) failed++;
// Rows render only while expanded; the open seed server-renders the body.
const cardOpenHtml = renderToString(React.createElement(DiffHighlightCard, { open: true }));
console.log((/Wallpaper glass/.test(cardOpenHtml) ? "PASS" : "FAIL") + " card wallpaper row");
if (!/Wallpaper glass/.test(cardOpenHtml)) failed++;
process.exit(failed === 0 ? 0 : 1);
