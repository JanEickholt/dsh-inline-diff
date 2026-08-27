// Host-half anchor test: drive the presenter wrapper with a cached
// before/after pair shaped like the real pipeline's {path, before, after}
// outcome, then assert outgoing diff hunks carry correct 1-based starts.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

// Load the ESM host half without Node's module resolution touching optional
// deps: read the file, rewrite its bare imports to data-URL stubs.
const source = readFileSync(new URL("../lib/index.js", import.meta.url), "utf8");
const stubSettings = "data:text/javascript," + encodeURIComponent("export const settingsNamespace=(n)=>'inline-diff:'+n;");
const stubZ = "data:text/javascript," + encodeURIComponent(`
	const chainable = () => { const self = () => self; return new Proxy(self, { get: (_t, prop) => prop === Symbol.toPrimitive ? undefined : chainable() }); };
	const u = (v) => chainable();
	u.object = (s) => s;
	u.union = (v) => chainable();
	export default u;
`);
const plugged = source
	.replace(/from "@deepseek-ai\/dsh-settings"/g, `from "${stubSettings}"`)
	.replace(/from "@deepseek-ai\/schemastery"/g, `from "${stubZ}"`);
const plugin = await import("data:text/javascript," + encodeURIComponent(plugged));
const { apply } = plugin;

// --- fake tools service -------------------------------------------------
class FakeTools {
	constructor() { this.defs = new Map(); this.listeners = new Map(); }
	register(definition) { this.defs.set(definition.name, definition); this.emit("tools/change"); }
	get(name) { return this.defs.get(name); }
	on(event, listener) {
		(this.listeners.get(event) ?? this.listeners.set(event, new Set()).get(event)).add(listener);
		return () => this.listeners.get(event)?.delete(listener);
	}
	async waterfall(_carrier, event, ...args) {
		const list = [...this.listeners.get(event) ?? []];
		const positional = args.slice(0, -1);
		const terminal = args[args.length - 1];
		const run = (i) => i < 0 ? terminal(...positional) : list[i](...positional, () => run(i - 1));
		return run(list.length - 1);
	}
	emit(event, ...args) { for (const l of this.listeners.get(event) ?? []) l(...args); }
}

// Presenters mirroring the stock edit tool's result view.
function editDefinition() {
	return {
		name: "edit",
		presentResult(args, result) {
			if (result.isError) return undefined;
			return {
				card: "diff",
				diffs: result.meta.diffs.map((d) => ({ path: d.path, oldText: d.oldText, newText: d.newText })),
			};
		},
	};
}

const before = [
	"alpha",
	"bravo",
	"charlie",
	"delta",
	"echo",
	"foxtrot",
	"golf",
	"hotel",
	"india",
	"juliett",
].join("\n");
const after = before.replace("delta\n", "").replace("juliett", "JULIETT-EDITED");

// The producer's shape for that change: two hunks with ±3 context lines
// (gap > 6 shared lines keeps them separate).
const metaDiffs = [
	{ // deletion hunk: lines 3..7 context → oldStart 4 area
		path: "/w/demo.txt",
		oldText: ["charlie", "delta", "echo"].join("\n"),
		newText: ["charlie", "echo"].join("\n"),
	},
	{ // modification hunk near the tail
		path: "/w/demo.txt",
		oldText: ["golf", "hotel", "india", "juliett"].join("\n"),
		newText: ["golf", "hotel", "india", "JULIETT-EDITED"].join("\n"),
	},
];

const tools = new FakeTools();
tools.register(editDefinition());

const captured = [];
const fakeCtx = {
	effect() {},
	inject(services, fn) {
		if (services.length === 1 && services[0] === "tools") {
			fn({
				effect(factory) { return factory(); },
				on: (event, listener) => tools.on(event, listener),
				tools,
			});
		}
	},
};

apply(fakeCtx);

// Settle one edit-style call through the execute waterfall.
await tools.waterfall(undefined, "tools/execute", { name: "edit", arguments: { file_path: "/w/demo.txt" } }, async () => ({
	isError: false,
	value: { path: "/w/demo.txt", before, after },
}));

// Serve the result view twice; stamps must attach both times (serve-time recompute).
for (let serve = 0; serve < 2; serve++) {
	const view = tools.get("edit").presentResult({}, { isError: false, meta: { diffs: structuredClone(metaDiffs) } });
	assert.equal(view.card, "diff");
	captured.push(view);
}
const [first] = captured;
// Deletion hunk: charlie starts at file line 3, echo now on line 3 after delta's removal.
assert.equal(first.diffs[0].oldStart, 3, "old start of deletion hunk");
assert.equal(first.diffs[0].newStart, 3, "new start of deletion hunk");
// Modification hunk: golf is line 7 before the deletion shifts it to 6.
assert.equal(first.diffs[1].oldStart, 7, "old start of modification hunk");
assert.equal(first.diffs[1].newStart, 6, "new start shifted by deleted line");

// Idempotent serves do not accumulate drift.
assert.equal(captured[1].diffs[0].oldStart, 3);
assert.equal(captured[1].diffs[1].newStart, 6);

console.log("PASS host anchors: starts, shifts, repeated serves");
