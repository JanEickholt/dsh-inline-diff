// Host-half anchor test: drive the presentationMeta wrapper with a settled
// {before, after} value shaped like the real pipeline's execute outcome, then
// assert the projected meta hunks carry correct 1-based starts.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { EventEmitter } from "node:events";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
	u.number = (v) => chainable();
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

// Line-start anchoring: the needle's text also sits at the tail of an
// earlier, deeper-indented line ("  bravo" ends in "bravo"), where a raw
// indexOf would hit first and stamp line 1. Hunks are whole lines, so the
// only true position is line 4.
const shadowedBefore = ["  bravo", "charlie", "delta", "bravo", "charlie", "delta"].join("\n");
const shadowedAfter = ["  bravo", "charlie", "delta", "bravo", "charlie", "DELTA"].join("\n");
const shadowedEdit = {
	name: "edit",
	output: {
		presentationMeta() {
			return { diffs: [{
				path: "/w/shadow.txt",
				oldText: ["bravo", "charlie", "delta"].join("\n"),
				newText: ["bravo", "charlie", "DELTA"].join("\n"),
			}] };
		},
	},
};
const shadowedMeta = tools.createSuccessResult({}, shadowedEdit, { before: shadowedBefore, after: shadowedAfter });
assert.equal(shadowedMeta.diffs[0].oldStart, 4, "old side anchors on a line start, not a line tail");
assert.equal(shadowedMeta.diffs[0].newStart, 4, "new side anchors on a line start, not a line tail");

// Recurring hunk text: the hunk's whole block also occurs earlier, as
// complete lines, so a first-hit scan stamps it there. Hunks are exactly
// the producer's (jsdiff, 3 context lines) for these pairs; only the
// joint placement — shared gaps, agreeing tails — names the true lines.
const placedEdit = (diffs) => ({
	name: "edit",
	output: { presentationMeta() { return { diffs: diffs.map((hunk) => ({ ...hunk })) }; } },
});
// A closing block appended to at EOF (no trailing newline before): the
// same four "}" lines open the file. jsdiff: @@ -6,4 +6,5 @@.
const tailBefore = ["}", "}", "}", "}", "w", "}", "}", "}", "}"].join("\n");
const tailMeta = tools.createSuccessResult({}, placedEdit([{
	path: "/w/tail.txt", oldText: "}\n}\n}\n}", newText: "}\n}\n}\n}\nd",
}]), { before: tailBefore, after: tailBefore + "\nd" });
assert.equal(tailMeta.diffs[0].oldStart, 6, "recurring block anchors where it changed (old)");
assert.equal(tailMeta.diffs[0].newStart, 6, "recurring block anchors where it changed (new)");
// An insertion between identical lines: the old side is six copies of a
// line that fills the file. jsdiff: @@ -8,6 +8,7 @@.
const sameBefore = Array.from({ length: 20 }, () => "same").join("\n") + "\n";
const sameLines = sameBefore.split("\n");
sameLines.splice(10, 0, "changed");
const sameMeta = tools.createSuccessResult({}, placedEdit([{
	path: "/w/same.txt",
	oldText: Array(6).fill("same").join("\n"),
	newText: ["same", "same", "same", "changed", "same", "same", "same"].join("\n"),
}]), { before: sameBefore, after: sameLines.join("\n") });
assert.equal(sameMeta.diffs[0].oldStart, 8, "insertion amid identical lines anchors its old side");
assert.equal(sameMeta.diffs[0].newStart, 8, "insertion amid identical lines anchors its new side");
// Whole-file delete: the old side ends in a newline the empty new side
// lacks, which hunk text never carries.
const wipedMeta = tools.createSuccessResult({}, placedEdit([{
	path: "/w/wiped.txt", oldText: "one\ntwo", newText: "",
}]), { before: "one\ntwo\n", after: "" });
assert.equal(wipedMeta.diffs[0].oldStart, 1, "whole-file delete anchors the old side");
assert.equal(wipedMeta.diffs[0].newStart, null, "whole-file delete leaves the empty side unstamped");

// The wrapper keeps the projector's receiver (the kernel calls it on
// `output`), and unloading puts back the very function it replaced rather
// than a copy bound to the definition.
const receiverOutput = {
	tag: "output",
	presentationMeta() { return { diffs: metaDiffs(), receiver: this?.tag }; },
};
const bareProjector = receiverOutput.presentationMeta;
const receiverMeta = tools.createSuccessResult({}, { name: "edit", output: receiverOutput }, { before, after });
assert.equal(receiverMeta.receiver, "output", "wrapped projector runs on its own receiver");
assert.equal(receiverMeta.diffs[0].oldStart, 3, "receiver-dependent projector still stamps");

// Unload restores the original projector: fresh projections go out unstamped.
for (const dispose of disposers) dispose();
const restored = tools.get("edit").output.presentationMeta({}, { before, after });
assert.equal(restored.diffs[0].oldStart, undefined, "unload restores the bare projector");
assert.equal(receiverOutput.presentationMeta, bareProjector, "unload restores the identical function");

// --- fenced read route --------------------------------------------------
// Drive the webServer handler with a fake request: the response must carry
// the capped head of a large file and the whole text of a small one.
const routes = [];
apply({
	effect(factory) { return factory(); },
	inject(services, fn) {
		if (services.length === 1 && services[0] === "webServer") {
			fn({ webServer: { register(route) { routes.push(route); return () => {}; } } });
		}
	},
});
assert.equal(routes.length, 1, "the read route registers");
const workspace = mkdtempSync(join(tmpdir(), "inline-diff-read-"));
const READ_CAP = 512 * 1024;
const bigText = "0123456789abcdef\n".repeat(Math.ceil((READ_CAP * 2) / 17));
writeFileSync(join(workspace, "big.txt"), bigText);
writeFileSync(join(workspace, "small.txt"), "one\ntwo\n");
const postRead = (path, headers = { host: "127.0.0.1:3080" }, route = routes[0]) => new Promise((resolvePost) => {
	const req = new EventEmitter();
	req.url = "/dsh-inline-diff/api/read";
	req.method = "POST";
	req.headers = headers;
	req.destroy = () => {};
	let status = 0;
	const res = {
		writeHead(code) { status = code; },
		end(body) { resolvePost({ status, ...JSON.parse(body) }); },
	};
	void route.handler(req, res);
	req.emit("data", Buffer.from(JSON.stringify({ cwd: workspace, path })));
	req.emit("end");
});
try {
	const big = await postRead("big.txt");
	assert.equal(big.kind, "text", "large text file reads as text");
	assert.equal(big.truncated, true, "large file is flagged truncated");
	assert.equal(big.size, bigText.length, "size reports the whole file");
	assert.equal(big.content, bigText.slice(0, READ_CAP), "content is exactly the capped head");
	const small = await postRead("small.txt");
	assert.equal(small.content, "one\ntwo\n", "small file reads whole");
	assert.equal(small.truncated, false, "small file is not truncated");
	const escape = await postRead("../outside.txt");
	assert.equal(escape.kind, "error", "paths outside the workspace are refused");

	// Trust fence: the route answers file text for a client-chosen cwd, so a
	// DNS-rebound page (foreign Host), a cross-site fetch or a foreign
	// Origin must be refused before any read — the host's /api refuses them.
	const rebound = await postRead("small.txt", { host: "attacker.example:3080" });
	assert.equal(rebound.status, 403, "a non-loopback Host is refused");
	assert.equal(rebound.content, undefined, "a refused request reads nothing");
	const crossSite = await postRead("small.txt", { host: "127.0.0.1:3080", "sec-fetch-site": "cross-site" });
	assert.equal(crossSite.status, 403, "a cross-site fetch is refused");
	const foreignOrigin = await postRead("small.txt", { host: "localhost:3080", origin: "http://attacker.example" });
	assert.equal(foreignOrigin.status, 403, "a foreign Origin is refused");
	assert.equal((await postRead("small.txt", {})).status, 403, "a request without Host is refused");
	const sameOrigin = await postRead("small.txt", { host: "localhost:3080", origin: "http://localhost:3080" });
	assert.equal(sameOrigin.content, "one\ntwo\n", "a same-origin loopback request reads");

	// With the host's `connection` service composed, its verdict (Host/Origin
	// fence plus login cookie) is authoritative.
	let verdict = 401;
	const fencedRoutes = [];
	apply({
		effect(factory) { return factory(); },
		inject(services, fn) {
			if (services.length !== 1) return;
			const child = { effect(factory) { return factory(); } };
			if (services[0] === "connection") fn({ ...child, connection: { requestRejection: () => verdict } });
			if (services[0] === "webServer") fn({ ...child, webServer: { register(route) { fencedRoutes.push(route); return () => {}; } } });
		},
	});
	const unauthenticated = await postRead("small.txt", { host: "127.0.0.1:3080" }, fencedRoutes[0]);
	assert.equal(unauthenticated.status, 401, "the connection service's rejection is served");
	assert.equal(unauthenticated.content, undefined, "an unauthenticated request reads nothing");
	verdict = undefined;
	const admitted = await postRead("small.txt", { host: "127.0.0.1:3080" }, fencedRoutes[0]);
	assert.equal(admitted.content, "one\ntwo\n", "an admitted request reads");
} finally {
	rmSync(workspace, { recursive: true, force: true });
}

console.log("PASS host anchors: starts, shifts, repeated settles, create, line starts, receiver, restore, fenced read");
