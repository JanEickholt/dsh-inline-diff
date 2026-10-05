// Cross-version regression: drive the built client half and the host half
// against fake hosts shaped like DSH 0.1.5, 0.1.7 and 0.2.0, and assert the
// plugin loads and routes on every one of them.
//
// The client half is the shipped bundle (lib/client.js), because that is what
// the module loader materializes. The host half is loaded twice: once against
// the real schemastery (3.18.2, no `.volatile` — the 0.1.5 floor) and once
// against a stub that has it (3.18.4, the 0.1.7+ floor).
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";

const clientSource = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");
const hostSource = readFileSync(new URL("../lib/index.js", import.meta.url), "utf8");

let failed = 0;
function check(ok, name) {
	console.log((ok ? "PASS" : "FAIL") + " " + name);
	if (!ok) failed++;
}

//#region client bundle load
let factory;
globalThis.window = {
	__ModuleLoader__: { load(registration) { factory = registration.factory; } },
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
new Function("window", "require", clientSource)(globalThis.window, requireStub);
const client = factory(requireStub);
//#endregion

//#region fake hosts
function fakeForm(writes, value) {
	const snapshot = { status: "ready", writable: true, value };
	return {
		getSnapshot: () => snapshot,
		subscribe: () => () => {},
		set: (field, next) => { writes.push([field, next]); return Promise.resolve(true); },
		unset: () => Promise.resolve(true),
	};
}

/**
 * A context shaped like cordis's: runtime `inject` fires its callback once
 * every named service is provided (cordis delivers the service on the
 * callback's context), reading a service this plugin did not inject throws,
 * and the ancestor context is the one that carries it. The plugin's legacy
 * service probe has to walk past the throw to find the logger.
 *
 * `refuses` names the seats this host will not take a card in. DSH's register
 * policy rejects some seats outright and the slot core throws on a name no entry
 * declared; either way the plugin only learns by attempting the registration.
 */
function cordisLikeCtx(services, refuses = []) {
	const own = {
		effect(execute) { return execute(); },
		inject(names, fn) {
			if (names.every((name) => Object.hasOwn(services, name))) {
				fn(Object.assign(Object.create(services), { effect: (execute) => execute() }));
			}
		},
		on() { return () => {}; },
		slots: {
			inject(name, fn) { (registrars[name] ??= []).push(fn); },
			register(meta, component) {
				if (refuses.includes(meta.name)) {
					throw new Error(`slot "${meta.name}" is not declared (a parent entry's children table must declare it)`);
				}
				registrations.push({ meta, component });
				return () => {};
			},
		},
	};
	const registrars = {};
	const registrations = [];
	const ctx = Object.assign(Object.create(services), own);
	return {
		ctx: new Proxy(ctx, {
			get(target, prop, receiver) {
				if (Object.hasOwn(target, prop)) return Reflect.get(target, prop, receiver);
				if (Object.hasOwn(services, prop)) {
					throw new Error(`cannot get property "${String(prop)}" without inject`);
				}
				return Reflect.get(target, prop, receiver);
			},
		}),
		registrars,
		registrations,
	};
}

/**
 * A context shaped like the 0.2.x slot registry: `slots.spec` resolves
 * declared slot names, and `slots.inject` is the declaration-lifetime
 * helper — its callbacks run once per declaration epoch, so the host
 * re-runs them on every reopen of the declaring section.
 */
function registry2Ctx(services, declared) {
	const own = {
		effect(execute) { return execute(); },
		inject(names, fn) {
			if (names.every((name) => Object.hasOwn(services, name))) {
				fn(Object.assign(Object.create(services), { effect: (execute) => execute() }));
			}
		},
		on() { return () => {}; },
		slots: {
			spec(name) { return declared.has(name) ? { kind: "list", scope: "root" } : undefined; },
			inject(name, fn) { (registrars[name] ??= []).push(fn); },
			register(meta, component) {
				if (!declared.has(meta.name)) {
					throw new Error(`slot "${meta.name}" is not declared (a parent entry's children table must declare it)`);
				}
				registrations.push({ meta, component });
				return () => {};
			},
		},
	};
	const registrars = {};
	const registrations = [];
	const ctx = Object.assign(Object.create(services), own);
	return {
		ctx: new Proxy(ctx, {
			get(target, prop, receiver) {
				if (Object.hasOwn(target, prop)) return Reflect.get(target, prop, receiver);
				if (Object.hasOwn(services, prop)) {
					throw new Error(`cannot get property "${String(prop)}" without inject`);
				}
				return Reflect.get(target, prop, receiver);
			},
		}),
		registrars,
		registrations,
	};
}

/**
 * A host context that composes `settings` and neither `tools` nor `webServer`,
 * so only the settings branch of apply() runs.
 */
function hostCtx(settings) {
	return {
		fiber: { id: "inline-diff" },
		inject(names, fn) {
			if (names[0] === "settings") fn({ settings, effect: (execute) => execute() });
		},
	};
}

/**
 * Run every registrar the plugin filed, the way a live slot owner would. A
 * registrar hands back a generator, so the body only runs once something
 * iterates it.
 */
function drain(host) {
	for (const list of Object.values(host.registrars)) {
		for (const fn of list) {
			const result = fn();
			if (result?.[Symbol.iterator] && !Array.isArray(result)) {
				for (const _entry of result) { /* drive the generator to completion */ }
			}
		}
	}
	return host.registrations;
}

/** Registration options the plugin filed under one slot name. */
const slotsFor = (registrations, name) =>
	registrations.filter((row) => row.meta.name === name).map((row) => row.meta);
//#endregion

//#region 0.1.7 client host
// configForms owns the transport and the direct-registration registry still
// takes cards. 0.1.7 dropped settings.plugin.item, so this host refuses that
// seat and the card falls back to the plugins tab.
{
	const writes = [];
	const form = fakeForm(writes, { highlight: "lines" });
	const warnings = [];
	const host = cordisLikeCtx(
		{ configForms: { get: (ns) => (ns === "inline-diff" ? form : null) }, logger: { warn: (m) => warnings.push(m) } },
		["settings.plugin.item"],
	);
	client.apply(host.ctx);
	const registrations = drain(host);

	check(client.inject.length === 1 && client.inject[0] === "slots",
		"only slots is injected, so a renamed transport cannot leave the plugin dormant");

	const rows = slotsFor(registrations, "tool.call.toolview");
	check(rows.length === 2 && rows.every((row) => row.key === "edit" || row.key === "write"),
		"0.1.7 host: both edit and write rows register");

	const tabs = slotsFor(registrations, "settings.plugins.tab");
	check(tabs.length === 1 && tabs[0].id === "inline-diff",
		"0.1.7 host: the card registers as a plugins-settings tab keyed on the entry id");
	check(typeof tabs[0]?.label === "function" && typeof tabs[0]?.inject === "function",
		"0.1.7 host: the tab carries a label and the setters face");
	check(slotsFor(registrations, "settings.plugin.item").length === 0,
		"0.1.7 host: nothing is filed under the name 0.1.7 removed");
	check(warnings.length === 1 && /refused by "settings\.plugin\.item"/.test(warnings[0]),
		"0.1.7 host: the refused seat is reported through the host logger");

	const card = registrations.find((row) => row.meta.name === "settings.plugins.tab").component;
	const cardHtml = renderToString(React.createElement(card, tabs[0].inject()));
	check(/Syntax, diff highlighting/.test(cardHtml), "0.1.7 host: the card renders through the injected setters");

	tabs[0].inject().setFold("on");
	await new Promise((resolve) => setTimeout(resolve, 0));
	check(writes.length === 1 && writes[0][0] === "fold" && writes[0][1] === "on",
		"0.1.7 host: a card write lands on the config form");
}
//#endregion

//#region 0.2.0 client host
// The 0.2.x registry reworked the seats: settings.plugin.item is gone, a
// bundle's configuration lives in the plugin manager's keyed
// plugins.bundle.config slot (filed under the package name, the seat
// dsh-client-auto-continue takes), and the declaration exists only while
// the Plugins page is mounted — the card must follow that lifetime through
// the declaration helper instead of a one-shot direct registration (which
// would go stale after the page closes).
{
	const writes = [];
	const form = fakeForm(writes, { highlight: "lines" });
	const host = registry2Ctx(
		{ configForms: { get: (ns) => (ns === "inline-diff" ? form : null) } },
		new Set(["tool.call.toolview", "plugins.bundle.config"]),
	);
	let threw = null;
	try { client.apply(host.ctx); } catch (error) { threw = error; }
	check(threw === null, "0.2.0 host: apply does not throw");

	check(host.registrars["settings.plugins.tab"] === undefined
		&& host.registrars["settings.plugin.item"] === undefined,
		"0.2.0 host: no entry is filed into the legacy plugins settings seats");
	check(host.registrars["plugins.bundle.config"] !== undefined,
		"0.2.0 host: the card is filed through the declaration-lifetime helper");
	const registrations = drain(host);
	const reopen = () => {
		for (const fn of host.registrars["plugins.bundle.config"] ?? []) {
			const result = fn();
			if (result?.[Symbol.iterator] && !Array.isArray(result)) {
				for (const _entry of result) { /* drive the generator to completion */ }
			}
		}
	};
	const configs = slotsFor(registrations, "plugins.bundle.config");
	check(configs.length === 1 && configs[0].key === "dsh-inline-diff",
		"0.2.0 host: the config entry is keyed by the package name");
	check(typeof configs[0]?.inject === "function",
		"0.2.0 host: the config entry carries the setters face");

	// The Plugins page unmounts and remounts on every reopen; the helper
	// re-runs the registration per declaration epoch.
	reopen();
	check(slotsFor(host.registrations, "plugins.bundle.config").length === 2,
		"0.2.0 host: every declaration epoch re-registers the config entry");

	// The page component renders the preference rows flat — always
	// extended, no card shell — through the injected setters face (the
	// owner props the plugin manager adds — view/form — pass through
	// harmlessly).
	const page = registrations.find((row) => row.meta.name === "plugins.bundle.config").component;
	const pageHtml = renderToString(React.createElement(page, { ...configs[0].inject(), view: "page" }));
	check(/Diff highlighting/.test(pageHtml) && /did-prefs/.test(pageHtml) && !/did-cardhead/.test(pageHtml),
		"0.2.0 host: the config page renders flat prefs through the injected setters");

	configs[0].inject().setFold("on");
	await new Promise((resolve) => setTimeout(resolve, 0));
	check(writes.length === 1 && writes[0][0] === "fold" && writes[0][1] === "on",
		"0.2.0 host: a card write lands on the config form");

	// The transport is resolved through runtime injection, not a context
	// read: this cordis-4-shaped host throws on un-injected service reads,
	// and the card still binds.
	check(slotsFor(registrations, "tool.call.toolview").length === 2,
		"0.2.0 host: both diff rows register alongside the card");
}
//#endregion

//#region 0.1.5 client host
{
	const writes = [];
	const bound = [];
	const host = cordisLikeCtx({
		settingsScope: {
			bind(spec) { bound.push(spec); return fakeForm(writes, { fold: "off" }); },
		},
	});
	client.apply(host.ctx);
	const registrations = drain(host);

	check(bound.length === 1 && bound[0].namespace === "inline-diff",
		"0.1.5 host: the settings scope binds the same namespace");
	const items = slotsFor(registrations, "settings.plugin.item");
	check(items.length === 1 && items[0].key === "inline-diff",
		"0.1.5 host: the card still registers as a settings.plugin.item");
	check(slotsFor(registrations, "settings.plugins.tab").length === 0,
		"0.1.5 host: nothing is filed under the name 0.1.5 predates");
	check(slotsFor(registrations, "tool.call.toolview").length === 2,
		"0.1.5 host: both diff rows register");
}
//#endregion

//#region client that never mounted the item-slot owner
// The reported field case: a profile that composes
// dsh-client-ui-settings-plugin-inventory but not
// dsh-client-ui-settings-plugins declares no settings.plugin.item, and the
// registration was refused with the card simply absent.
{
	const host = cordisLikeCtx(
		{ settingsScope: { bind: () => fakeForm([], {}) } },
		["settings.plugin.item"],
	);
	client.apply(host.ctx);
	const registrations = drain(host);
	const tabs = slotsFor(registrations, "settings.plugins.tab");
	check(tabs.length === 1 && tabs[0].id === "inline-diff",
		"undeclared item slot: the card falls back to the plugins tab");
	check(slotsFor(registrations, "settings.plugin.item").length === 0,
		"undeclared item slot: nothing is filed under the missing name");
}
//#endregion

//#region client host with no settings transport
{
	const host = cordisLikeCtx({});
	client.apply(host.ctx);
	const registrations = drain(host);
	check(slotsFor(registrations, "tool.call.toolview").length === 2,
		"no settings transport: diffs still render");
	check(registrations.filter((row) => row.meta.name.startsWith("settings.")).length === 0,
		"no settings transport: no settings card is claimed");
}
//#endregion

//#region host that owns neither settings slot
// DSH's slot core throws on a name no entry declared. A client that reports
// configForms but has not mounted the tab owner must lose the card, not the
// diff rows, and must say so.
{
	const warnings = [];
	const host = cordisLikeCtx(
		{
			configForms: { get: () => fakeForm([], {}) },
			logger: { warn: (message) => warnings.push(message) },
		},
		["settings.plugin.item", "settings.plugins.tab"],
	);
	let threw = null;
	try { client.apply(host.ctx); } catch (error) { threw = error; }
	const registrations = drain(host);
	check(threw === null, "an unowned settings slot does not throw out of apply");
	check(slotsFor(registrations, "tool.call.toolview").length === 2,
		"an unowned settings slot leaves the diff rows registered");
	check(warnings.length === 2 && warnings.every((message) => /settings card refused by/.test(message)),
		"both refused seats are reported through the host logger");
}
//#endregion

//#region 0.1.7 preparing tool-call phase
// 0.1.7 splits a running call into preparing (no arguments yet) and started.
{
	const host = cordisLikeCtx({ configForms: { get: () => fakeForm([], {}) } });
	client.apply(host.ctx);
	const row = drain(host).find((entry) => entry.meta.name === "tool.call.toolview").component;
	const preparing = {
		phase: "preparing",
		callId: "c1",
		name: "edit",
		turn: 1,
		step: 1,
		time: 0,
		subCalls: [],
	};
	const html = renderToString(React.createElement(row, {
		block: preparing, toolName: "edit", cwd: "/w", home: "/h", openFile: () => {},
	}));
	check(/did-root/.test(html) && !/did-grid/.test(html),
		"0.1.7 preparing phase: renders the placeholder, not a bogus diff");
}
//#endregion

//#region host half
// 0.1.5 floor: a schemastery that has no `.volatile` (the resolved dependency
// drifts, so the floor is pinned by a stub, not by the installed version).
{
	const plainZ = "data:text/javascript," + encodeURIComponent(`
		const node = (json) => ({
			meta: json.meta,
			toJSON: () => json,
			default: (value) => node({ ...json, default: value }),
		});
		const u = (...values) => node({ type: "union", values });
		u.union = (...values) => u(...values);
		u.number = () => node({ type: "number" });
		u.object = (dict) => ({ dict, toJSON: () => ({ type: "object", dict }) });
		export default u;
	`);
	const plugged = hostSource.replace(/from "@deepseek-ai\/schemastery"/g, `from "${plainZ}"`);
	const plugin = await import("data:text/javascript," + encodeURIComponent(plugged));
	const calls = [];
	const settings = { register: (...args) => { calls.push(args); } };
	plugin.apply(hostCtx(settings));
	check(calls.length === 1 && calls[0][0] === "inline-diff" && calls[0][1] !== undefined,
		"0.1.5 host: settings.register claims the namespace");
	check(plugin.Config !== undefined && typeof plugin.Config.toJSON === "function",
		"Config export is present for the 0.1.7+ entry schema");
	const fields = plugin.Config.dict;
	check(Object.keys(fields).length === 7 && fields.highlight.meta?.volatile === undefined,
		"without schemastery .volatile the entry schema stays a plain object schema");
}

// 0.1.7+ floor: a schemastery that has `.volatile`, and a settings service that
// only offers `configure`.
{
	const volatileZ = "data:text/javascript," + encodeURIComponent(`
		const node = (json) => ({
			meta: json.meta,
			toJSON: () => json,
			default: (value) => node({ ...json, default: value }),
			volatile: () => node({ ...json, meta: { ...(json.meta || {}), volatile: true } }),
		});
		const u = (...values) => node({ type: "union", values });
		u.union = (...values) => u(...values);
		u.number = () => node({ type: "number" });
		u.object = (dict) => ({ dict, toJSON: () => ({ type: "object", dict }) });
		export default u;
	`);
	const plugged = hostSource.replace(/from "@deepseek-ai\/schemastery"/g, `from "${volatileZ}"`);
	const plugin = await import("data:text/javascript," + encodeURIComponent(plugged));

	const seen = [];
	const settings = { configure: (presentation, owner) => { seen.push([presentation, owner]); return () => {}; } };
	const ctx = hostCtx(settings);
	ctx.fiber = { id: "inline-diff" };
	plugin.apply(ctx);
	check(seen.length === 1 && seen[0][0].auto === false && seen[0][1] === ctx.fiber,
		"0.1.7 host: settings.configure claims the page policy on THIS plugin's fiber");

	const dict = plugin.Config.dict;
	const names = Object.keys(dict);
	check(names.length === 7 && names.every((name) => dict[name].meta?.volatile === true),
		"0.1.7 host: every Config field is volatile, so the form can edit it");
}
//#endregion

process.exit(failed === 0 ? 0 : 1);
