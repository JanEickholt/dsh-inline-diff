// Host-half anchor test: drive the presentationMeta wrapper with a settled
// {before, after} value shaped like the real pipeline's execute outcome, then
// assert the projected meta hunks carry correct 1-based starts.
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
	constructor() { this.defs = new Map(); this.listeners = new Set(); }
	register(definition) { this.defs.set(definition.name, definition); this.emit(); }
	get(name) { return this.defs.get(name); }
	on(_event, listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
	emit() { for (const l of [...this.listeners]) l(); }
	// Mirrors the kernel's dispatch gate: presentationMeta is invoked through
	// createSuccessResult with the scope-resolved definition.
	createSuccessResult(_exec, tool, value) { return tool.output.presentationMeta({}, value); }
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
// (gap > 6 shared lines keeps them separate). presentationMeta replays this
// list fresh per call, like the real projector computing from the value pair.
const metaDiffs = () => [
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
tools.register({
	name: "edit",
	output: {
		presentationMeta() { return { diffs: metaDiffs() }; },
	},
});

const captured = [];
const disposers = [];
const fakeCtx = {
	effect(factory) { const d = factory(); disposers.push(d); return d; },
	inject(services, fn) {
		if (services.length === 1 && services[0] === "tools") {
			fn({
				effect(factory) { const d = factory(); disposers.push(d); return d; },
				on: (event, listener) => tools.on(event, listener),
				tools,
			});
		}
	},
};

apply(fakeCtx);

// Settle twice: stamps must attach to each fresh projection (kernel-side
// snapshot makes every call independent, so no drift can accumulate).
for (let settle = 0; settle < 2; settle++) {
	const meta = tools.get("edit").output.presentationMeta({}, { before, after });
	captured.push(meta);
}
const [first, second] = captured;
// Deletion hunk: charlie starts at file line 3, echo now on line 3 after delta's removal.
assert.equal(first.diffs[0].oldStart, 3, "old start of deletion hunk");
assert.equal(first.diffs[0].newStart, 3, "new start of deletion hunk");
// Modification hunk: golf is line 7 before the deletion shifts it to 6.
assert.equal(first.diffs[1].oldStart, 7, "old start of modification hunk");
assert.equal(first.diffs[1].newStart, 6, "new start shifted by deleted line");

// Independent settles do not accumulate drift.
assert.equal(second.diffs[0].oldStart, 3);
assert.equal(second.diffs[1].newStart, 6);

// Create (write): old side has no text, so only the new side stamps.
tools.register({
	name: "write",
	output: {
		presentationMeta() {
			return { diffs: [{ path: "/w/new.txt", oldText: null, newText: "one\ntwo\n" }] };
		},
	},
});
// Registered after apply, so only the dispatch gate wraps it: the settled
// call must flow through createSuccessResult like the kernel does.
const created = tools.createSuccessResult({}, tools.get("write"), { before: null, after: "one\ntwo\n" });
assert.equal(created.diffs[0].newStart, 1, "create stamps the new side");
assert.equal(created.diffs[0].oldStart, undefined, "create leaves the old side unstamped");

// A value without the settled texts stays untouched (no stamps, no throw).
const untouched = tools.get("edit").output.presentationMeta({}, {});
assert.equal(untouched.diffs[0].oldStart, undefined, "malformed value stays unstamped");

// Dispatch gate: a scope-resolved definition that mounted OUTSIDE any
// registration this plugin saw (pre-mounted agent) still gets wrapped when
// its first dispatch resolves it through createSuccessResult.
const scopedEdit = {
	name: "edit",
	output: { presentationMeta() { return { diffs: metaDiffs() }; } },
};
const scopedMeta = tools.createSuccessResult({}, scopedEdit, { before, after });
assert.equal(scopedMeta.diffs[0].oldStart, 3, "dispatch gate wraps pre-mounted scopes");
assert.equal(scopedMeta.diffs[1].newStart, 6, "dispatch gate stamps like the direct path");

// Unload restores the original projector: fresh projections go out unstamped.
for (const dispose of disposers) dispose();
const restored = tools.get("edit").output.presentationMeta({}, { before, after });
assert.equal(restored.diffs[0].oldStart, undefined, "unload restores the bare projector");

console.log("PASS host anchors: starts, shifts, repeated settles, create, restore");
