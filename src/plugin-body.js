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

			const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
			const adoptScope = () => {
				const snapshot = scope.getSnapshot();
				const section = snapshot.value;
				setWordsMode(section === undefined || section[HIGHLIGHT_FIELD] !== HIGHLIGHT_LINES);
				setKeepIndent(section !== undefined && section[INDENT_FIELD] === INDENT_KEEP);
				setSyntaxOn(section === undefined || section[SYNTAX_FIELD] !== SYNTAX_OFF);
				setNumbersOn(section === undefined || section[NUMBERS_FIELD] !== NUMBERS_OFF);
				adoptSettingsState(snapshot);
			};
			ctx.effect(() => scope.subscribe(adoptScope), "dsh-inline-diff: settings adoption");
			adoptScope();
			const writeHighlight = (mode) => {
				setWordsMode(mode !== HIGHLIGHT_LINES); // optimistic echo; adoption confirms
				scope.set(HIGHLIGHT_FIELD, mode).catch(adoptScope);
			};
			const writeIndent = (mode) => {
				setKeepIndent(mode === INDENT_KEEP); // optimistic echo; adoption confirms
				scope.set(INDENT_FIELD, mode).catch(adoptScope);
			};
			const writeSyntax = (mode) => {
				setSyntaxOn(mode !== SYNTAX_OFF); // optimistic echo; adoption confirms
				scope.set(SYNTAX_FIELD, mode).catch(adoptScope);
			};
			const writeNumbers = (mode) => {
				setNumbersOn(mode !== NUMBERS_OFF); // optimistic echo; adoption confirms
				scope.set(NUMBERS_FIELD, mode).catch(adoptScope);
			};

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
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: SETTINGS_NAMESPACE,
				inject: () => ({ setHighlight: writeHighlight, setIndent: writeIndent, setSyntax: writeSyntax, setNumbers: writeNumbers })
			}, DiffHighlightCard));
		}

		// Required host services.
		const inject = ["slots", "settingsScope"];
		//#endregion
