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

const block = {
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
	block, toolName: "edit", cwd: "/w", home: "/h",
}));

// No gutters: rows render as a plain two-column split without numbers.
if (html.includes("did-no") || />140<|>141</.test(html)) throw new Error("gutter numbers still rendered");

const checks = [
	["hljs keyword span", /<span class="hljs-keyword"/.test(html)],
	["hljs comment span", /hljs-comment/.test(html)],
	["word chip present", /did-insword/.test(html)],
	["chip merged with token class", /class="hljs-keyword did-insword"|class="did-insword hljs-keyword"/.test(html)],
	["row tint present", /did-insbg/.test(html)],
	["no gutter numbers", !/did-no/.test(html)],
	["no sign markers", !/did-sign/.test(html)],
	["file head stats", /did-filehead/.test(html)],
];
let failed = 0;
for (const [name, ok] of checks) {
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

// Settings card smoke: renders its header with the updated description.
const DiffHighlightCard = collect("settings.plugin.item")[0];
if (typeof DiffHighlightCard !== "function") throw new Error("card component not resolved");
const cardHtml = renderToString(React.createElement(DiffHighlightCard, {}));
console.log((/Syntax, diff highlighting/.test(cardHtml) ? "PASS" : "FAIL") + " card description");
if (!/Syntax, diff highlighting/.test(cardHtml)) failed++;
process.exit(failed === 0 ? 0 : 1);
