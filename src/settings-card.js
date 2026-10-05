		//#region plugin settings card
		// Settings card: Words (token chips on paired rows) vs Lines-only (row
		// tint), Strip vs Keep for shared leading indentation, Syntax on/off,
		// Wallpaper glass on/off. Reads through the shared mode subscriptions;
		// writes go through the injected setters, which echo optimistically
		// and let the scope subscription confirm. Hidden while the Host does
		// not serve the namespace; buttons disable while the document is
		// read-only.
		function chevron(open) {
			return react.createElement("span", { className: "did-chev" + (open ? " did-chevopen" : "") },
				react.createElement("svg", {
					width: 14, height: 14, viewBox: "0 0 14 14", "aria-hidden": true,
					fill: "none", stroke: "currentColor", strokeWidth: 1.5,
					strokeLinecap: "round", strokeLinejoin: "round"
				}, react.createElement("path", { d: "M3.5 5.25 7 8.75l3.5-3.5" })));
		}

		function segmentButton(mode, label, active, choose, disabled) {
			return react.createElement("button", {
				type: "button",
				key: mode,
				"aria-pressed": active,
				disabled,
				onClick: () => choose(mode)
			}, label);
		}

		// The seven preference rows shared by both seats: the collapsible
		// card (0.1.x seats) and the flat Plugins-page view (0.2.x seat).
		function PreferenceRows(props) {
			const { writable, choose, chooseIndent, chooseSyntax, chooseNumbers, chooseWallpaper, chooseFold, chooseFoldLines } = props;
			return react.createElement(react.Fragment, null,
				react.createElement("div", { className: "did-setting" },
					react.createElement("span", { className: "did-setting-title" }, tr("highlight.title")),
					react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("highlight.title") },
						segmentButton(HIGHLIGHT_WORDS, tr("highlight.words"), props.words, choose, !writable),
						segmentButton(HIGHLIGHT_LINES, tr("highlight.lines"), !props.words, choose, !writable)
					)
				),
				react.createElement("div", { className: "did-setting" },
					react.createElement("span", { className: "did-setting-title" }, tr("indent.title")),
					react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("indent.title") },
						segmentButton(INDENT_STRIP, tr("indent.strip"), !props.keepIndent, chooseIndent, !writable),
						segmentButton(INDENT_KEEP, tr("indent.keep"), props.keepIndent, chooseIndent, !writable)
					)
				),
				react.createElement("div", { className: "did-setting" },
					react.createElement("span", { className: "did-setting-title" }, tr("syntax.title")),
					react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("syntax.title") },
						segmentButton(SYNTAX_ON, tr("syntax.on"), props.syntaxOn, chooseSyntax, !writable),
						segmentButton(SYNTAX_OFF, tr("syntax.off"), !props.syntaxOn, chooseSyntax, !writable)
					)
				),
				react.createElement("div", { className: "did-setting" },
					react.createElement("span", { className: "did-setting-title" }, tr("numbers.title")),
					react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("numbers.title") },
						segmentButton(NUMBERS_ON, tr("numbers.on"), props.numbersOn, chooseNumbers, !writable),
						segmentButton(NUMBERS_OFF, tr("numbers.off"), !props.numbersOn, chooseNumbers, !writable)
					)
				),
				react.createElement("div", { className: "did-setting" },
					react.createElement("span", { className: "did-setting-title" }, tr("wallpaper.title")),
					react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("wallpaper.title") },
						segmentButton(WALLPAPER_ON, tr("wallpaper.on"), props.wallpaperGlass, chooseWallpaper, !writable),
						segmentButton(WALLPAPER_OFF, tr("wallpaper.off"), !props.wallpaperGlass, chooseWallpaper, !writable)
					)
				),
				react.createElement("div", { className: "did-setting" },
					react.createElement("span", { className: "did-setting-title" }, tr("fold.title")),
					react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("fold.title") },
						segmentButton(FOLD_ON, tr("fold.on"), props.foldRows, chooseFold, !writable),
						segmentButton(FOLD_OFF, tr("fold.off"), !props.foldRows, chooseFold, !writable)
					)
				),
				props.foldRows ? react.createElement("div", { className: "did-setting" },
					react.createElement("label", { className: "did-setting-title", htmlFor: "did-fold-lines" },
						tr("fold.threshold")),
					react.createElement("input", {
						id: "did-fold-lines",
						type: "number",
						className: "did-numinput",
						min: FOLD_LINES_MIN,
						max: FOLD_LINES_MAX,
						value: props.foldDraft !== null ? props.foldDraft : String(props.foldKeep),
						disabled: !writable,
						onChange: (event) => props.setFoldDraft(event.target.value),
						onBlur: props.commitFoldDraft,
						onKeyDown: (event) => {
							if (event.key === "Enter") {
								props.commitFoldDraft();
								event.target.blur();
							}
						}
					})
				) : null
			);
		}

		// Shared state bundle for both seats: mode subscriptions, the fold
		// stepper draft, the settings/read-only state, and the setters face.
		// `null` while the Host does not serve the namespace yet.
		function usePreferenceState(props) {
			const setHighlight = props && props.setHighlight;
			const setIndent = props && props.setIndent;
			const setSyntax = props && props.setSyntax;
			const setNumbers = props && props.setNumbers;
			const setWallpaper = props && props.setWallpaper;
			const setFold = props && props.setFold;
			const setFoldLines = props && props.setFoldLines;
			const [words, setWords] = react.useState(getWordsMode());
			react.useEffect(() => onWordsMode(setWords), []);
			const [keepIndent, setKeepIndent] = react.useState(getKeepIndent());
			react.useEffect(() => onKeepIndent(setKeepIndent), []);
			const [syntaxOn, setSyntaxOn] = react.useState(getSyntaxOn());
			react.useEffect(() => onSyntaxOn(setSyntaxOn), []);
			const [numbersOn, setNumbersOn] = react.useState(getNumbersOn());
			react.useEffect(() => onNumbersOn(setNumbersOn), []);
			const [wallpaperGlass, setWallpaperGlass] = react.useState(getWallpaperGlass());
			react.useEffect(() => onWallpaperGlass(setWallpaperGlass), []);
			const [foldRows, setFoldRows] = react.useState(getFoldRows());
			react.useEffect(() => onFoldRows(setFoldRows), []);
			const [foldKeep, setFoldKeepEcho] = react.useState(getFoldKeep());
			react.useEffect(() => onFoldKeep(setFoldKeepEcho), []);
			// The stepper holds a local draft while focused and commits once on
			// blur (or Enter): per-keystroke writes would durably store every
			// intermediate value ("1" of "12") and out-of-range raw text. The
			// committed value is clamped, matching the client-side clamp.
			const [foldDraft, setFoldDraft] = react.useState(null);
			// An adoption-driven unmount (fold switching off) skips blur; drop
			// the draft so a remounted stepper starts from the stored value.
			react.useEffect(() => {
				if (!foldRows) setFoldDraft(null);
			}, [foldRows]);
			const [settings, setSettings] = react.useState(getSettingsState());
			react.useEffect(() => onSettingsState(setSettings), []);
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);
			if (!settings.ready) return null;
			const writable = settings.writable
				&& typeof setHighlight === "function" && typeof setIndent === "function"
				&& typeof setSyntax === "function" && typeof setNumbers === "function"
				&& typeof setWallpaper === "function" && typeof setFold === "function"
				&& typeof setFoldLines === "function";
			const commitFoldDraft = () => {
				if (foldDraft === null) return;
				const raw = Number.parseInt(foldDraft, 10);
				setFoldDraft(null);
				if (!Number.isNaN(raw)) {
					const clamped = Math.min(FOLD_LINES_MAX, Math.max(FOLD_LINES_MIN, raw));
					if (clamped !== foldKeep) setFoldLines(clamped);
				}
			};
			return {
				words, keepIndent, syntaxOn, numbersOn, wallpaperGlass, foldRows, foldKeep, foldDraft,
				setFoldDraft, commitFoldDraft, writable,
				choose: writable ? setHighlight : () => {},
				chooseIndent: writable ? setIndent : () => {},
				chooseSyntax: writable ? setSyntax : () => {},
				chooseNumbers: writable ? setNumbers : () => {},
				chooseWallpaper: writable ? setWallpaper : () => {},
				chooseFold: writable ? setFold : () => {},
				chooseFoldLines: writable ? setFoldLines : () => {},
			};
		}

		function DiffHighlightCard(props) {
			const state = usePreferenceState(props);
			// `open` only seeds the collapsed/expanded state; tests use it to
			// server-render the rows. Slot inject never passes it.
			const [open, setOpen] = react.useState(Boolean(props && props.open));
			if (state === null) return null;
			return react.createElement("li", { className: "did-card" + (open ? " did-cardopen" : "") },
				react.createElement("button", {
					type: "button",
					className: "did-cardhead",
					"aria-expanded": open,
					onClick: () => setOpen(!open)
				},
					react.createElement("span", { className: "did-cardtext" },
						react.createElement("span", { className: "did-cardname" }, tr("card.name")),
						react.createElement("span", { className: "did-carddesc" }, tr("card.desc"))),
					chevron(open)),
				open ? react.createElement("div", { className: "did-cardbody" },
					state.writable ? null : react.createElement("p", { className: "did-readonly", role: "status" },
						tr("readonly.note")),
					react.createElement(PreferenceRows, state)
				) : null
			);
		}

		// The Plugins-page seat (0.2.x `plugins.bundle.config`, view:'page'):
		// the manager's section already owns the chrome, so the rows render
		// flat and always extended — no card shell, no background.
		function DiffHighlightPrefs(props) {
			const state = usePreferenceState(props);
			if (state === null) return null;
			return react.createElement("div", { className: "did-prefs" },
				state.writable ? null : react.createElement("p", { className: "did-readonly", role: "status" },
					tr("readonly.note")),
				react.createElement(PreferenceRows, state)
			);
		}
		//#endregion
