// Fold band tests: settings-gated middle folding with click-to-toggle.
// SSR part: off by default (empty section and missing field), band placement
// and counts, no data-ri on the band, first/last rows kept.
// Client part (jsdom): clicking the band reveals the full hunk, the collapse
// bar re-folds it — reversible in place, without reconciliation errors (the
// interaction the row-identity keys (7a8648b) exist to make safe).
import { readFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";

const source = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");
const requireStub = (spec) => (spec === "react" ? React : null);

globalThis.window = {
	__ModuleLoader__: {},
};
globalThis.document = {
	createElement(tag) { return { tag, dataset: {}, style: {}, textContent: "" }; },
	head: { appendChild() {} },
};
Object.defineProperty(globalThis, "navigator", { value: { languages: ["en"] }, configurable: true });

let failed = 0;
const check = (ok, name) => {
	console.log((ok ? "PASS" : "FAIL") + " " + name);
	if (!ok) failed++;
};

// Load the plugin with a fixed settings section; returns { row, card } —
// the InlineDiffRow from the toolview slot and the DiffHighlightCard from
// the settings.plugin.item slot.
function loadPlugin(section) {
	let factory;
	const win = { __ModuleLoader__: { load(r) { factory = r.factory; } } };
	new Function("window", "require", source)(win, requireStub);
	const plugin = factory(requireStub);
	const toolview = [];
	const cards = [];
	plugin.apply({
		effect(fn) { fn(); },
		inject() {},
		slots: {
			inject(name, fn) {
				const result = fn();
				for (const component of Array.isArray(result) || result?.[Symbol.iterator] ? result : [result]) {
					if (typeof component === "function") {
						if (name === "settings.plugin.item") cards.push(component);
						else toolview.push(component);
					}
				}
			},
			register: (_meta, component) => component,
		},
		settingsScope: {
			bind: () => ({
				getSnapshot: () => ({ status: "ready", writable: true, value: section ?? {} }),
				subscribe: () => () => {},
				set: () => ({ catch() {} }),
			}),
		},
	});
	return { row: toolview[0], card: cards[0] };
}

const ROWS = 24; // foldable: 8 visible + 8 hidden + 8 visible
function block() {
	return {
		kind: "edit",
		resultView: {
			card: "diff",
			diffs: [{
				path: "src/a.ts",
				oldText: Array.from({ length: ROWS }, (_, i) => "old line " + i).join("\n"),
				newText: Array.from({ length: ROWS }, (_, i) => "new line " + i).join("\n"),
			}],
		},
	};
}

// Empty section (no stored prefs): fold off, every row renders, no band.
const OffRow = loadPlugin({}).row;
const offHtml = renderToString(React.createElement(OffRow, { block: block(), toolName: "edit", cwd: "/w", home: "/h" }));
check(!offHtml.includes("did-fold"), "empty section renders no band");
check((offHtml.match(/class="did-code/g) ?? []).length === ROWS * 2, "empty section renders all rows");

// Section without the field (older host): fold stays off.
const OldRow = loadPlugin({ highlight: "words" }).row;
const oldHtml = renderToString(React.createElement(OldRow, { block: block(), toolName: "edit", cwd: "/w", home: "/h" }));
check(!oldHtml.includes("did-fold"), "missing fold field renders no band");

// Fold on: one band per column with the hidden count, 16 visible rows, no
// data-ri on the band, first/last rows present.
const OnRow = loadPlugin({ fold: "on" }).row;
const onHtml = renderToString(React.createElement(OnRow, { block: block(), toolName: "edit", cwd: "/w", home: "/h" }));
check((onHtml.match(/class="did-fold"/g) ?? []).length === 2, "fold on renders one band per column");
check(onHtml.includes("Show 8 hidden lines"), "band names the hidden count");
check((onHtml.match(/class="did-code/g) ?? []).length === 32, "fold on renders 16 rows across both columns");
check(!/class="did-fold"[^>]*data-ri/.test(onHtml), "band carries no data-ri");
check(onHtml.includes('data-ri="0"') && onHtml.includes('data-ri="15"'), "band keeps first and last visible rows");
check(!onHtml.includes('data-ri="16"'), "row counter compresses over folded rows");

// Small hunks never fold: below FOLD_KEEP*2 + FOLD_MIN_HIDDEN rows, no band.
const small = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: [{
			path: "src/a.ts",
			oldText: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl",
			newText: "",
		}],
	},
};
const smallHtml = renderToString(React.createElement(OnRow, { block: small, toolName: "edit", cwd: "/w", home: "/h" }));
check(!smallHtml.includes('class="did-fold"'), "12-row hunk stays unfolded");

// Configurable threshold: foldLines scales the visible ends. 24-row hunk
// with 3 per end -> 6 visible rows, 18 hidden.
const Keep3Row = loadPlugin({ fold: "on", foldLines: 3 }).row;
const keep3Html = renderToString(React.createElement(Keep3Row, { block: block(), toolName: "edit", cwd: "/w", home: "/h" }));
check(keep3Html.includes("Show 18 hidden lines"), "foldLines sets the band count");
check((keep3Html.match(/class="did-code/g) ?? []).length === 12, "foldLines 3 renders 6 rows across both columns");

// Garbage values fall back to the default 8 per end.
const BadRow = loadPlugin({ fold: "on", foldLines: "abc" }).row;
const badHtml = renderToString(React.createElement(BadRow, { block: block(), toolName: "edit", cwd: "/w", home: "/h" }));
check(badHtml.includes("Show 8 hidden lines"), "non-numeric foldLines falls back to 8");

// MAX_ROWS × fold: hunks past the truncation cut must not emit phantom bars,
// and a bar truncated mid-hunk advertises only what it actually controls.
// 59 plain 10-row hunks (590 rows, all below the fold threshold) leave a
// 10-row budget for the 24-row foldable hunk (keep=8): it renders its 8 head
// rows + 2 tail rows, so the nominal "8 hidden" shrinks to the 2 reachable
// rows and the bar says 2, not 8.
function manySmall(count) {
	return {
		kind: "edit",
		resultView: {
			card: "diff",
			diffs: Array.from({ length: count }, (_, i) => ({
				path: "src/g" + i + ".ts",
				oldText: Array.from({ length: 10 }, (_, j) => "o" + i + "." + j).join("\n"),
				newText: Array.from({ length: 10 }, (_, j) => "n" + i + "." + j).join("\n"),
			})),
		},
	};
}
const TruncRow = loadPlugin({ fold: "on" }).row;
const truncBlock = manySmall(59);
truncBlock.resultView.diffs.push(block().resultView.diffs[0]);
const truncHtml = renderToString(React.createElement(TruncRow, { block: truncBlock, toolName: "edit", cwd: "/w", home: "/h" }));
check((truncHtml.match(/class="did-code/g) ?? []).length === 600 * 2, "truncated render stops at MAX_ROWS");
check(!truncHtml.includes("Show 8 hidden lines"), "mid-truncated bar does not overstate the count");
check(truncHtml.includes("Show 2 hidden lines"), "mid-truncated bar advertises the reachable count");

// Hunks fully past the cut render no bar at all (the budget exactly runs out
// after 37 folded hunks of 16 visible rows each; the 38th renders rows but no
// controllable range, the rest render nothing).
const many = {
	kind: "edit",
	resultView: {
		card: "diff",
		diffs: Array.from({ length: 45 }, (_, i) => ({
			path: "src/f" + i + ".ts",
			oldText: Array.from({ length: ROWS }, (_, j) => "old " + i + "." + j).join("\n"),
			newText: Array.from({ length: ROWS }, (_, j) => "new " + i + "." + j).join("\n"),
		})),
	},
};
const GhostRow = loadPlugin({ fold: "on" }).row;
const ghostHtml = renderToString(React.createElement(GhostRow, { block: many, toolName: "edit", cwd: "/w", home: "/h" }));
check((ghostHtml.match(/class="did-fold"/g) ?? []).length === 37 * 2, "no phantom bars on fully truncated hunks");

// Budget dying inside the foldable hunk's head keep: no bar at all.
// 593 rows before the foldable hunk leave 7 < keep=8: the hunk renders 7 head
// rows and expanding could reach only 7 rows, so max(0, 7-8)=0 suppresses it.
function prefixRows(rowsList) {
	return {
		kind: "edit",
		resultView: {
			card: "diff",
			diffs: rowsList.map((count, i) => ({
				path: "src/g" + i + ".ts",
				oldText: Array.from({ length: count }, (_, j) => "o" + i + "." + j).join("\n"),
				newText: Array.from({ length: count }, (_, j) => "n" + i + "." + j).join("\n"),
			})),
		},
	};
}
const HeadCutRow = loadPlugin({ fold: "on" }).row;
const headCutBlock = prefixRows([...Array(59).fill(10), 3]);
headCutBlock.resultView.diffs.push(block().resultView.diffs[0]);
const headCutHtml = renderToString(React.createElement(HeadCutRow, { block: headCutBlock, toolName: "edit", cwd: "/w", home: "/h" }));
check(!headCutHtml.includes('class="did-fold"'), "bar suppressed when budget dies inside the head keep");

// Budget dying exactly at keep: also no bar (expandedReach - keep = 0).
const boundaryBlock = prefixRows([...Array(59).fill(10), 2]);
boundaryBlock.resultView.diffs.push(block().resultView.diffs[0]);
const boundaryHtml = renderToString(React.createElement(HeadCutRow, { block: boundaryBlock, toolName: "edit", cwd: "/w", home: "/h" }));
check(!boundaryHtml.includes('class="did-fold"'), "bar suppressed when budget dies exactly at keep");

// Settings card exposes the stepper only while fold is on.
const setters = { setFold: () => {}, setFoldLines: () => {} };
const onCard = loadPlugin({ fold: "on", foldLines: 5 }).card;
const onCardHtml = renderToString(React.createElement(onCard, { open: true, ...setters }));
check(onCardHtml.includes('type="number"') && onCardHtml.includes('value="5"'), "fold on shows the stepper with the stored value");
const offCard = loadPlugin({ fold: "off" }).card;
const offCardHtml = renderToString(React.createElement(offCard, { open: true, ...setters }));
check(!offCardHtml.includes('type="number"'), "fold off hides the stepper");

// ---- Client render: click reveal (jsdom) ----
try {
	const { JSDOM } = await import("jsdom");
	const dom = new JSDOM("<!doctype html><html><body><div id=root></div></body></html>");
	globalThis.document = dom.window.document;
	globalThis.window = dom.window;
	Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
	const { createRoot } = await import("react-dom/client");
	const { flushSync } = await import("react-dom");

	const warnings = [];
	const origError = console.error;
	console.error = (...args) => { warnings.push(String(args[0])); };

	const root = createRoot(document.getElementById("root"));
	const el = React.createElement(OnRow, { block: block(), toolName: "edit", cwd: "/w", home: "/h" });
	flushSync(() => { root.render(el); });
	const folded = document.querySelectorAll(".did-code").length;
	const band = document.querySelector(".did-fold");
	check(folded === 32 && band !== null, "client render folds by default");

	band.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
	await new Promise((resolve) => setTimeout(resolve, 20));
	const revealed = [...document.querySelectorAll(".did-code")].length;
	check(revealed === ROWS * 2, "click reveals the full hunk");
	const collapseBar = document.querySelector(".did-fold .did-fold-chevronopen");
	check(collapseBar !== null && document.body.textContent.includes("Hide 8 lines"), "revealed hunk keeps a collapse bar");
	const ranges = document.querySelectorAll(".did-foldrange");
	check(ranges.length === 2 && [...ranges].every((r) => r.querySelectorAll(".did-code").length === 8), "collapsible range is wrapped per column");
	check(ranges[0]?.previousElementSibling?.classList.contains("did-fold") === true, "collapse bar sits directly before its range");
	check(document.querySelector(".did-fold + .did-foldrange") !== null, "bar and range are adjacent siblings");

	document.querySelector(".did-grid").dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
	await new Promise((resolve) => setTimeout(resolve, 20));
	check(document.querySelectorAll(".did-hoverrow").length === 0, "plain row hover leaves no block wash");

	collapseBar.closest(".did-fold").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
	await new Promise((resolve) => setTimeout(resolve, 20));
	const refolded = [...document.querySelectorAll(".did-code")].length;
	check(refolded === 32 && document.body.textContent.includes("Show 8 hidden lines"), "second click re-folds the hunk");
	check(warnings.filter((w) => w.includes("same key")).length === 0, "no duplicate-key warnings across the toggle");
	console.error = origError;
	root.unmount();

	// Stepper: typing holds a local draft (no store writes per keystroke);
	// blur or Enter commits once, clamped to 1..100.
	const writes = [];
	const cardHost = document.createElement("div");
	document.body.appendChild(cardHost);
	const cardRoot = createRoot(cardHost);
	const noSetter = () => {};
	const cardEl = React.createElement(onCard, {
		open: true,
		setHighlight: noSetter,
		setIndent: noSetter,
		setSyntax: noSetter,
		setNumbers: noSetter,
		setWallpaper: noSetter,
		setFold: noSetter,
		setFoldLines: (value) => writes.push(value),
	});
	console.error = (...args) => { warnings.push(String(args[0])); };
	flushSync(() => { cardRoot.render(cardEl); });
	const input = document.querySelector("#did-fold-lines");
	const setNativeValue = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
	const type = (text) => {
		setNativeValue.call(input, text);
		input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
	};
	// jsdom focus is unreliable under a React root; React maps onBlur to
	// delegated focusout, so commit by dispatching that event.
	const blur = () => input.dispatchEvent(new dom.window.Event("focusout", { bubbles: true }));
	type("1");
	type("12");
	await new Promise((resolve) => setTimeout(resolve, 20));
	check(writes.length === 0, "typing the stepper writes nothing");
	check(input.value === "12", "stepper shows the draft while focused");
	blur();
	await new Promise((resolve) => setTimeout(resolve, 20));
	check(writes.length === 1 && writes[0] === 12, "blur commits the clamped value once");
	type("500");
	blur();
	await new Promise((resolve) => setTimeout(resolve, 20));
	check(writes.length === 2 && writes[1] === 100, "out-of-range draft commits clamped");
	type("");
	blur();
	await new Promise((resolve) => setTimeout(resolve, 20));
	check(writes.length === 2 && input.value === "5", "empty draft commits nothing and snaps back");
	check(warnings.filter((w) => w.includes("same key")).length === 0, "stepper interaction raises no key warnings");
	console.error = origError;
	cardRoot.unmount();
	cardHost.remove();

	// Expanded hunk truncated mid-range: the collapse bar must advertise only
	// the cells it actually wraps. Reuse the truncation build (59×10 rows +
	// 24-row foldable hunk): expanding renders 8 head + 2 hidden rows in
	// budget, so the bar says "Hide 2 lines", not the nominal 8.
	console.error = (...args) => { warnings.push(String(args[0])); };
	const truncRoot = createRoot(document.getElementById("root"));
	flushSync(() => { truncRoot.render(React.createElement(TruncRow, { block: truncBlock, toolName: "edit", cwd: "/w", home: "/h" })); });
	const truncBar = document.querySelector(".did-fold");
	truncBar.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
	await new Promise((resolve) => setTimeout(resolve, 20));
	check(document.body.textContent.includes("Hide 2 lines"), "expanded truncated hunk names the reachable count");
	const truncRanges = document.querySelectorAll(".did-foldrange");
	check(truncRanges.length === 2 && [...truncRanges].every((r) => r.querySelectorAll(".did-code").length === 2), "expanded truncated range wraps the rendered rows only");
	check(warnings.filter((w) => w.includes("Each child")).length === 0, "no missing-key warnings (footer keyed)");
	console.error = origError;
	truncRoot.unmount();
} catch (err) {
	if (err?.code === "ERR_MODULE_NOT_FOUND") {
		console.log("SKIP client part: jsdom not installed");
	} else {
		console.log("FAIL client part threw: " + (err?.stack ?? err));
		failed++;
	}
}

process.exitCode = failed > 0 ? 1 : 0;
