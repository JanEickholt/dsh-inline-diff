		//#region stylesheet
		const CSS = `
/* Diff cards mount under .did-root in the conversation, the settings card
   under .did-card. */
.did-root, .did-card {
	/* Theme aliases, dark statics as fallbacks until theme CSS injects. The
	   code-block alias keeps cards matching the native code surface in any
	   theme or stylevault preset. */
	--did-border: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
	--did-surface: var(--dsw-alias-markdown-code-block, #1b1b1c);
	/* Native look: the banner alias token, no separator. */
	--did-banner: var(--dsw-alias-markdown-code-block-banner, #2c2c2e);
	--did-sep: transparent;
	--did-text: var(--dsw-alias-label-primary, #f9fafb);
	--did-text-secondary: var(--dsw-alias-label-secondary, #cfd3d6);
	--did-text-muted: var(--dsw-alias-label-tertiary, #adb2b8);
	--did-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08));
	--did-empty-bg: color-mix(in srgb, var(--dsw-alias-label-primary, #808080) 5%, transparent);
	--did-code-font: var(--dsw-font-markdown-code-block, 13px/22px var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace));

	/* Syntax colors use the GUI's --shiki-token-* vars; dsh-stylevault
	   overrides exactly these from its Colors panel, and theme-alias values
	   stand in when shiki vars are absent. */
	--did-syn-keyword: var(--shiki-token-keyword, var(--dsw-alias-state-error-primary, var(--did-text)));
	--did-syn-title: var(--shiki-token-function, var(--dsw-alias-brand-primary, var(--did-text)));
	--did-syn-attr: var(--shiki-token-constant, var(--dsw-alias-state-warn-primary, var(--did-text)));
	--did-syn-string: var(--shiki-token-string, var(--dsw-alias-state-success-primary, var(--did-text)));
	--did-syn-builtin: var(--shiki-token-parameter, var(--dsw-alias-state-warn-primary, var(--did-text)));
	--did-syn-comment: var(--shiki-token-comment, var(--dsw-alias-label-tertiary, var(--did-text)));
	--did-syn-tag: var(--shiki-token-keyword, var(--dsw-alias-state-success-primary, var(--did-text)));
	--did-syn-text: var(--shiki-foreground, var(--did-text));

	/* Add/remove palette derives from the theme's success/error aliases via
	   color-mix, so tints follow the theme. */
	--did-add-stat: var(--dsw-alias-state-success-primary, #22c55e);
	--did-add-row: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 7%, transparent);
	--did-add-hover: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 18%, transparent);
	--did-add-word: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 18%, transparent);
	--did-del-stat: var(--dsw-alias-state-error-primary, #f25a5a);
	--did-del-row: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f25a5a) 7%, transparent);
	--did-del-hover: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f25a5a) 18%, transparent);
	--did-del-word: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f25a5a) 18%, transparent);
}

/* Native headers paint brand 12% over the surface, not the flat banner alias.
   While stylevault's paint layers are live (head watcher toggles .did-sv-themed),
   diff cards copy that rendered recipe; otherwise the alias above stands. The
   Plugins-page card is excluded: its ladder below re-themes through the alias
   tokens anyway. */
.did-sv-themed .did-root {
	--did-banner: color-mix(in srgb, var(--dsw-alias-brand-primary, #808080) 12%, var(--did-surface));
	--did-sep: color-mix(in srgb, var(--dsw-alias-label-tertiary, #8b8f94) 25%, transparent);
}

.did-root {
	box-sizing: border-box;
	padding: 0;
	margin: 4px 0 2px;
	/* native code blocks carry no border, outline or shadow */
	border-radius: 12px;
	overflow: hidden;
	background: var(--did-surface);
	font-size: 12px;
	line-height: 19px;
}

/* The call errored: nothing was applied. The header carries the state
   (failed badge, toggle chevron); the attempted diff stays collapsed. */
.did-head.did-headtoggle {
	cursor: pointer;
	user-select: none;
}

.did-failedbadge {
	color: var(--did-del-stat);
	font-size: 11px;
	font-weight: 600;
}

.did-chev {
	color: var(--did-text-muted);
	font-size: 9px;
	transition: transform 0.12s ease;
}

.did-open .did-chev {
	transform: rotate(90deg);
}

.did-head {
	display: flex;
	align-items: center;
	gap: 8px;
	/* native banner geometry: 9px 14px, font-xs-13 */
	padding: 9px 14px;
	font: var(--dsw-font-xs-13, 13px/20px var(--dsw-font-family, system-ui, sans-serif));
	background: var(--did-banner);
	border-bottom: 1px solid var(--did-sep);
}

.did-tool {
	color: var(--did-text-secondary);
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 0.6px;
	text-transform: uppercase;
}

.did-stats {
	margin-left: auto;
	color: var(--did-text-muted);
	font-size: 12px;
	white-space: nowrap;
}

.did-indent {
	color: var(--did-text-muted);
	font-size: 10.5px;
	margin-right: 10px;
}

.did-addnum {
	color: var(--did-add-stat);
	font-weight: 600;
}

.did-delnum {
	color: var(--did-del-stat);
	font-weight: 600;
}

.did-filehead {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 6px 14px;
	/* native banner label: 12px/18px code family */
	font: 12px/18px var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
	background: var(--did-banner);
	border-bottom: 1px solid var(--did-sep);
}

.did-filepath {
	color: var(--did-text-secondary);
	font-size: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

button.did-path {
	appearance: none;
	border: 0;
	background: none;
	color: var(--did-text-secondary);
	font: inherit;
	padding: 1px 6px;
	border-radius: 4px;
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: left;
	max-width: 70%;
}

button.did-path:hover {
	background: var(--did-hover-bg);
	color: var(--did-text);
}

.did-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	column-gap: 12px;
	font: var(--did-code-font);
}

.did-col {
	min-width: 0;
}

/* Hover: row pairs share data-ri; a delegated handler marks both cells.
   Changed panes step their tint up; context panes get the shared wash. */
.did-code.did-hoverrow:not(.did-delbg):not(.did-insbg):not(.did-void) { background: var(--did-hover-bg); }
.did-code.did-delbg.did-hoverrow { background: var(--did-del-hover); }
.did-code.did-insbg.did-hoverrow { background: var(--did-add-hover); }

.did-code {
	position: relative;
	/* Left padding reserves the gutter on EVERY cell (including void ones) so
	   code text stays vertically aligned whether its row carries a number.
	   The lane sizes to the card's largest line number via --did-num-w. */
	padding: 0 8px 0 calc(4px + var(--did-num-w, 4ch) + 16px);
	/* Empty lines have no line box and would collapse to zero height, so
	   their gutter number renders on top of the next row's number. */
	min-height: 1.25em;
	min-height: 1lh;
	color: var(--did-text);
	min-width: 0;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	word-break: break-word;
}

/* 1-based file line numbers (real when anchored, window-relative fallback
   otherwise); renders on every row. Right-aligned tabular digits in a box at
   a 4px inset: the number hugs the edge and a wide lane separates it from the
   code, instead of floating mid-gutter pressed against the text. */
.did-num {
	position: absolute;
	left: 4px;
	width: var(--did-num-w, 4ch);
	text-align: right;
	font-variant-numeric: tabular-nums;
	color: var(--did-text-muted);
	user-select: none;
}

/* Numbers off: drop the gutter entirely — code text starts at the plain
   inset, like the right padding, and no number spans render at all. */
.did-nonumbers .did-code { padding-left: 8px; }

/* Changed rows carry a 3px colored edge on their pane's outer side. */
.did-delbg { background: var(--did-del-row); box-shadow: inset 3px 0 0 var(--did-del-stat); }
.did-insbg { background: var(--did-add-row); box-shadow: inset 3px 0 0 var(--did-add-stat); }
.did-delword { background: var(--did-del-word); border-radius: 3px; }
.did-insword { background: var(--did-add-word); border-radius: 3px; }
.did-void { background: var(--did-empty-bg); }

.did-more {
	padding: 4px 8px;
	color: var(--did-text-muted);
	font-size: 11px;
	border-top: 1px solid var(--did-sep);
}

/* Plugins-page card: remap its surfaces to the page's bg-layer ladder, which
   native settings cards here render with, so it matches siblings under the
   stock theme and under any stylevault preset. The code-block family above
   stays reserved for conversation diff cards. */
.did-card {
	--did-banner: var(--dsw-alias-bg-layer-3, #383a42);
	/* native open accordion surface: one step below the closed elevation */
	--did-surface: var(--dsw-alias-bg-layer-2, #2c2c2e);
	--did-text: var(--dsw-alias-label-primary, #f9fafb);
	--did-text-secondary: var(--dsw-alias-label-secondary, #cfd3d6);
	--did-text-muted: var(--dsw-alias-label-tertiary, #adb2b8);
	--did-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08));
	--did-border: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
	border: 1px solid var(--did-border);
	/* native settings cards: elevated bg-layer-3 closed, bg-layer-2 open */
	background: var(--did-banner);
	border-radius: 12px;
	list-style: none;
	transition: border-color 0.16s, background 0.16s;
}

.did-card:hover,
.did-card.did-cardopen {
	border-color: var(--dsw-alias-label-dimmed, rgba(128, 128, 128, 0.45));
}

.did-card.did-cardopen {
	background: var(--did-surface);
}

.did-cardhead {
	appearance: none;
	width: 100%;
	font: inherit;
	color: inherit;
	text-align: left;
	cursor: pointer;
	background: none;
	border: 0;
	border-radius: 12px;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
}

.did-cardhead:focus-visible {
	outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);
	outline-offset: -2px;
}

.did-cardtext {
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
	flex: 1;
}

.did-cardname {
	color: var(--did-text);
	font-size: 15px;
	font-weight: 600;
	line-height: 1.4;
}

.did-carddesc {
	color: var(--did-text-muted);
	font-size: 13px;
	line-height: 1.5;
}

/* Scoped to the settings card: unscoped, these re-style the diff card's
   failed chevron (display:flex, transition override). */
.did-card .did-chev {
	flex: none;
	color: var(--did-text-muted);
	display: flex;
	transition: transform 0.16s;
}

.did-card .did-chevopen {
	transform: rotate(180deg);
}

.did-cardbody {
	border-top: 1px solid var(--did-border);
	margin: 0 16px;
	padding-bottom: 8px;
}

.did-readonly {
	color: var(--did-text-muted);
	margin: 10px 0 0;
	font-size: 12px;
	line-height: 1.5;
}

/* "Diff highlighting" control row: Words vs Lines-only segmented buttons */
.did-setting {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 8px;
}

.did-setting-title {
	color: var(--did-text);
	font-size: 13px;
}

.did-seg {
	display: flex;
	border: 1px solid var(--did-border);
	border-radius: 6px;
	overflow: hidden;
}

.did-seg button {
	appearance: none;
	border: 0;
	background: none;
	color: var(--did-text-secondary);
	font: inherit;
	font-size: 12px;
	line-height: 18px;
	padding: 4px 10px;
	cursor: pointer;
	white-space: nowrap;
}

.did-seg button + button {
	border-left: 1px solid var(--did-border);
}

.did-seg button:hover {
	background: var(--did-hover-bg);
}

.did-seg button[aria-pressed="true"] {
	background: var(--did-hover-bg);
	color: var(--did-text);
	font-weight: 600;
}

/* Syntax token classes -> the --did-syn-* palette above. Same class groups
   dsh-solution-explorer styles. */
.did-root .hljs-doctag, .did-root .hljs-keyword, .did-root .hljs-template-tag, .did-root .hljs-template-variable, .did-root .hljs-type, .did-root .hljs-variable.language_ { color: var(--did-syn-keyword); }
.did-root .hljs-title, .did-root .hljs-title.class_, .did-root .hljs-title.class_.inherited__, .did-root .hljs-title.function_ { color: var(--did-syn-title); }
.did-root .hljs-attr, .did-root .hljs-attribute, .did-root .hljs-literal, .did-root .hljs-meta, .did-root .hljs-number, .did-root .hljs-operator, .did-root .hljs-variable, .did-root .hljs-selector-attr, .did-root .hljs-selector-class, .did-root .hljs-selector-id { color: var(--did-syn-attr); }
.did-root .hljs-regexp, .did-root .hljs-string, .did-root .hljs-meta .hljs-string { color: var(--did-syn-string); }
.did-root .hljs-built_in, .did-root .hljs-symbol { color: var(--did-syn-builtin); }
.did-root .hljs-comment, .did-root .hljs-code, .did-root .hljs-formula { color: var(--did-syn-comment); }
.did-root .hljs-name, .did-root .hljs-quote, .did-root .hljs-selector-tag, .did-root .hljs-selector-pseudo { color: var(--did-syn-tag); }
.did-root .hljs-subst { color: var(--did-syn-text); }
.did-root .hljs-section { color: var(--did-syn-keyword); font-weight: bold; }
.did-root .hljs-bullet { color: var(--did-syn-attr); }
.did-root .hljs-emphasis { color: var(--did-syn-text); font-style: italic; }
.did-root .hljs-strong { color: var(--did-syn-text); font-weight: bold; }
`;
		//#endregion
