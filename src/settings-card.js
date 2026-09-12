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

		function DiffHighlightCard(props) {
			const setHighlight = props && props.setHighlight;
			const setIndent = props && props.setIndent;
			const setSyntax = props && props.setSyntax;
			const setNumbers = props && props.setNumbers;
			const setWallpaper = props && props.setWallpaper;
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
			const [settings, setSettings] = react.useState(getSettingsState());
			react.useEffect(() => onSettingsState(setSettings), []);
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);
			// `open` only seeds the collapsed/expanded state; tests use it to
			// server-render the rows. Slot inject never passes it.
			const [open, setOpen] = react.useState(Boolean(props && props.open));
			if (!settings.ready) return null;
			const writable = settings.writable
				&& typeof setHighlight === "function" && typeof setIndent === "function"
				&& typeof setSyntax === "function" && typeof setNumbers === "function"
				&& typeof setWallpaper === "function";
			const choose = writable ? setHighlight : () => {};
			const chooseIndent = writable ? setIndent : () => {};
			const chooseSyntax = writable ? setSyntax : () => {};
			const chooseNumbers = writable ? setNumbers : () => {};
			const chooseWallpaper = writable ? setWallpaper : () => {};
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
					writable ? null : react.createElement("p", { className: "did-readonly", role: "status" },
						tr("readonly.note")),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("highlight.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("highlight.title") },
							segmentButton(HIGHLIGHT_WORDS, tr("highlight.words"), words, choose, !writable),
							segmentButton(HIGHLIGHT_LINES, tr("highlight.lines"), !words, choose, !writable)
						)
					),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("indent.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("indent.title") },
							segmentButton(INDENT_STRIP, tr("indent.strip"), !keepIndent, chooseIndent, !writable),
							segmentButton(INDENT_KEEP, tr("indent.keep"), keepIndent, chooseIndent, !writable)
						)
					),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("syntax.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("syntax.title") },
							segmentButton(SYNTAX_ON, tr("syntax.on"), syntaxOn, chooseSyntax, !writable),
							segmentButton(SYNTAX_OFF, tr("syntax.off"), !syntaxOn, chooseSyntax, !writable)
						)
					),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("numbers.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("numbers.title") },
							segmentButton(NUMBERS_ON, tr("numbers.on"), numbersOn, chooseNumbers, !writable),
							segmentButton(NUMBERS_OFF, tr("numbers.off"), !numbersOn, chooseNumbers, !writable)
						)
					),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("wallpaper.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("wallpaper.title") },
							segmentButton(WALLPAPER_ON, tr("wallpaper.on"), wallpaperGlass, chooseWallpaper, !writable),
							segmentButton(WALLPAPER_OFF, tr("wallpaper.off"), !wallpaperGlass, chooseWallpaper, !writable)
						)
					)
				) : null
			);
		}
		//#endregion
