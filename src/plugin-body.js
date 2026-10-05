	//#region host compat
	// DSH 0.1.7 renamed the client settings transport: `ctx.settingsScope`
	// became `ctx.configForms`. The two bind calls return the same shape
	// (getSnapshot / subscribe / set), so only the lookup differs.
	//
	// `inject` cannot carry the choice: cordis leaves a plugin dormant when
	// a named service is absent, and since cordis 4 (DSH 0.2.x) a service
	// this plugin did not inject cannot be read off the context at all —
	// the context proxy throws before any ancestor lookup could answer.
	// So both candidate transports are resolved through RUNTIME injection:
	// the callback fires on whichever host provides its service, and a host
	// composing neither simply never fires one, leaving this plugin loaded
	// on its defaults instead of dormant.
	function bindSettingsForm(ctx, namespace, onBound) {
		let bound = false;
		const claim = (form) => {
			if (bound || form === null || form === undefined) return;
			bound = true;
			onBound(form);
		};
		ctx.inject(["configForms"], (svc) => {
			claim(svc.configForms.get(namespace));
		});
		ctx.inject(["settingsScope"], (svc) => {
			// 0.1.5 transport only; a host composing both resolves through
			// configForms, so this claim never overwrites that binding.
			if (!bound) claim(svc.settingsScope.bind({ namespace }));
		});
	}

	/**
	 * The Plugins-settings extension point is not pinned to a client version.
	 * 0.1.5 owns the keyed `settings.plugin.item` card seat, 0.1.7 added the
	 * `settings.plugins.tab` list, and 0.2.x moved a bundle's configuration
	 * into the plugin manager page: the keyed `plugins.bundle.config` slot,
	 * filed under the bundle's npm package name (the same seat
	 * dsh-client-auto-continue takes). The registry's own API surface picks
	 * the strategy: with `slots.spec`
	 * (0.2.x) the entry rides the declaration-lifetime helper, which
	 * re-registers on every declaration epoch — every Plugins-page reopen;
	 * older clients keep the attempt-both-seats direct registration with
	 * `slots/changed` retries, because a refusal is the only signal those
	 * hosts give.
	 */
	const PLUGIN_ITEM_SLOT = { name: "settings.plugin.item", key: SETTINGS_NAMESPACE };
	const PLUGINS_TAB_SLOT = {
		name: "settings.plugins.tab",
		id: SETTINGS_NAMESPACE,
		order: 100,
		label: () => tr("card.name"),
	};
	// 0.2.x plugin manager: the config section on this bundle's detail page.
	// The key is the package name the manager lists, not the entry id.
	const PLUGINS_CONFIG_SLOT = { name: "plugins.bundle.config", key: "dsh-inline-diff" };

	// Plain-object hosts (tests) answer service reads directly; cordis 4
	// throws on un-injected reads, so the walk ends empty there.
	function readHostService(ctx, name) {
		for (let node = ctx; node !== null && node !== Object.prototype; node = Object.getPrototypeOf(node)) {
			try {
				const value = node[name];
				if (value !== undefined) return value;
			} catch { /* cordis refuses un-injected reads; the ancestor holds it */ }
		}
		return undefined;
	}

	/**
	 * Adopt the durable preferences through whichever transport the host
	 * composes and file the card, or leave the defaults standing when the
	 * host composes neither. Every setter echoes optimistically; the form
	 * subscription is what confirms a write the Host refused.
	 */
	function wireSettings(ctx) {
		adoptSettingsState({ status: "unavailable", writable: false });
		bindSettingsForm(ctx, SETTINGS_NAMESPACE, (form) => {
			registerSettingsCard(ctx, adoptSettingsForm(ctx, form));
		});
	}

	function adoptSettingsForm(ctx, form) {
		const adopt = () => {
			const snapshot = form.getSnapshot();
			const section = snapshot.value;
			setWordsMode(section === undefined || section[HIGHLIGHT_FIELD] !== HIGHLIGHT_LINES);
			setKeepIndent(section !== undefined && section[INDENT_FIELD] === INDENT_KEEP);
			setSyntaxOn(section !== undefined && section[SYNTAX_FIELD] !== SYNTAX_OFF);
			setNumbersOn(section === undefined || section[NUMBERS_FIELD] !== NUMBERS_OFF);
			setWallpaperGlass(section === undefined || section[WALLPAPER_FIELD] !== WALLPAPER_OFF);
			setFoldRows(section !== undefined && section[FOLD_FIELD] === FOLD_ON);
			setFoldKeep(section === undefined ? undefined : section[FOLD_LINES_FIELD]);
			adoptSettingsState(snapshot);
		};
		ctx.effect(() => form.subscribe(adopt), "dsh-inline-diff: settings adoption");
		adopt();
		return {
			setHighlight: (mode) => { setWordsMode(mode !== HIGHLIGHT_LINES); form.set(HIGHLIGHT_FIELD, mode).catch(adopt); },
			setIndent: (mode) => { setKeepIndent(mode === INDENT_KEEP); form.set(INDENT_FIELD, mode).catch(adopt); },
			setSyntax: (mode) => { setSyntaxOn(mode !== SYNTAX_OFF); form.set(SYNTAX_FIELD, mode).catch(adopt); },
			setNumbers: (mode) => { setNumbersOn(mode !== NUMBERS_OFF); form.set(NUMBERS_FIELD, mode).catch(adopt); },
			setWallpaper: (mode) => { setWallpaperGlass(mode !== WALLPAPER_OFF); form.set(WALLPAPER_FIELD, mode).catch(adopt); },
			setFold: (mode) => { setFoldRows(mode === FOLD_ON); form.set(FOLD_FIELD, mode).catch(adopt); },
			setFoldLines: (value) => { setFoldKeep(value); form.set(FOLD_LINES_FIELD, value).catch(adopt); },
		};
	}

	/**
	 * File the card on whichever Plugins-settings seat this client accepts.
	 *
	 * The card stays the presentational component it always was; the setters
	 * ride the seat's `inject` face.
	 */
	// The bundle detail page renders the config entry bare inside a plain
	// section, so the rows render flat and always extended there — no card
	// shell, no background (the shape dsh-context's Plugins-page card
	// takes: the section owns the chrome).
	function DiffHighlightPage(props) {
		return react.createElement(DiffHighlightPrefs, props);
	}

	function registerSettingsCard(ctx, setters) {
		const slots = ctx.slots;
		if (typeof slots.register !== "function") return;

		// 0.2.x registry: the slot declaration exists exactly while the
		// Plugins page is mounted, so the entry must follow the
		// declaration — registered when the page opens, evicted when it
		// collapses, re-registered on every reopen. The helper owns that
		// lifetime and ties it to this plugin's fiber.
		if (typeof slots.spec === "function") {
			slots.inject(PLUGINS_CONFIG_SLOT.name, function* () {
				yield slots.register({ ...PLUGINS_CONFIG_SLOT, inject: () => setters }, DiffHighlightPage);
			});
			return;
		}

		// 0.1.x registry: seats are attempted directly, official keyed card
		// first, because a refusal is the only signal available — the owner
		// that declares a seat can also apply after this plugin does, so
		// `slots/changed` retries until a seat takes it.
		let seated = false;
		let reconciling = false;
		const warn = (seat, error) => {
			const message = `dsh-inline-diff: settings card refused by "${seat.name}": ${error}`;
			const logger = readHostService(ctx, "logger");
			if (logger !== undefined && typeof logger.warn === "function") {
				logger.warn(message);
			} else {
				console.warn(message);
			}
		};
		const place = (seat) => {
			try {
				slots.register({ ...seat, inject: () => setters }, DiffHighlightCard);
				return true;
			} catch (error) {
				warn(seat, error);
				return false;
			}
		};
		const reconcile = () => {
			if (reconciling || seated) return;
			reconciling = true;
			try {
				seated = place(PLUGIN_ITEM_SLOT) || place(PLUGINS_TAB_SLOT);
			} finally {
				reconciling = false;
			}
		};
		ctx.effect(() => {
			if (typeof ctx.on !== "function") return undefined;
			try { return ctx.on("slots/changed", reconcile); } catch { /* no event seat */ }
			return undefined;
		}, "dsh-inline-diff: settings card seat");
		reconcile();
	}
	//#endregion

	//#region plugin body
	function apply(ctx) {
		ctx.effect(() => {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-inline-diff";
			tag.textContent = CSS;
			document.head.appendChild(tag);
			return () => tag.remove();
		}, "dsh-inline-diff: stylesheet");

		// Toggle .did-sv-themed on <html> while dsh-stylevault's <style>
		// layers are live in <head> (empty when disabled), so the stylesheet
		// can swap card chrome between recipes without a reload.
		ctx.effect(() => {
			const docEl = document.documentElement;
			const sync = () => {
				try {
					const themed = [...document.querySelectorAll('style[data-plugin="dsh-stylevault"]')]
						.some((s) => (s.textContent || "").trim().length > 0);
					docEl.classList.toggle("did-sv-themed", themed);
				} catch { /* head-less test harness: no DOM to inspect */ }
			};
			sync();
			let obs = null;
			if (typeof MutationObserver === "function") {
				obs = new MutationObserver(sync);
				obs.observe(document.head, { childList: true, subtree: true, characterData: true });
			}
			return () => {
				if (obs) obs.disconnect();
				try { docEl.classList.remove("did-sv-themed"); } catch { /* head-less */ }
			};
		}, "dsh-inline-diff: stylevault marker");

		// Toggle .did-we-themed on <html> while dsh-wallpaper-engine's
		// wallpaper layers are live (body[data-we-wallpaper]) AND the
		// wallpaper pref is on, so the stylesheet can adopt the
		// liquid-glass recipe without a reload.
		ctx.effect(() => {
			const docEl = document.documentElement;
			const sync = () => {
				try {
					const live = document.body !== null
						&& document.body.hasAttribute("data-we-wallpaper");
					docEl.classList.toggle("did-we-themed", live && getWallpaperGlass());
				} catch { /* head-less test harness: no DOM to inspect */ }
			};
			sync();
			let obs = null;
			if (typeof MutationObserver === "function" && document.body) {
				obs = new MutationObserver(sync);
				obs.observe(document.body, { attributes: true, attributeFilter: ["data-we-wallpaper"] });
			}
			const unhook = onWallpaperGlass(sync);
			return () => {
				unhook();
				if (obs) obs.disconnect();
				try { docEl.classList.remove("did-we-themed"); } catch { /* head-less */ }
			};
	}, "dsh-inline-diff: wallpaper marker");

		// No settings transport at all (a host composing neither service)
		// still renders diffs; the preferences just stay on their defaults.
		wireSettings(ctx);

		// Follow the GUI language while the optional locale service is
		// composed; without one, the browser-derived seed stands.
		ctx.inject(["locale"], (localeCtx) => {
			const locale = localeCtx.locale;
			const adoptServiceLocale = () => adoptLocale(locale.getLocale().active);
			adoptServiceLocale();
			localeCtx.effect(() => locale.subscribe(adoptServiceLocale),
				"dsh-inline-diff: locale adoption");
		});

		// Negative priority: unloading the plugin restores the stock rows.
		ctx.slots.inject("tool.call.toolview", function* () {
			yield ctx.slots.register({ name: "tool.call.toolview", key: "edit", priority: -1 }, InlineDiffRow);
			yield ctx.slots.register({ name: "tool.call.toolview", key: "write", priority: -1 }, InlineDiffRow);
		});
	}

	// Only `slots` is required: the settings transport was renamed in DSH
	// 0.1.7, and an `inject` entry naming a service the host does not
	// compose leaves this plugin dormant instead of loading it.
	const inject = ["slots"];
	//#endregion
