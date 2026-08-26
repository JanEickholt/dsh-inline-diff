window.__ModuleLoader__.load({
	id: "dsh-inline-diff",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region stylesheet
		const CSS = `
/* Tokens live on both roots: diff cards mount under .did-root in the
   conversation, the settings card under .did-card in the Plugins page. */
.did-root, .did-card {
	/* host theme tokens first, fixed fallback second; every color tracks the
	   active GUI theme via --dsw-alias-* instead of a fixed palette */
	--did-border: var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.25));
	--did-surface: var(--dsw-alias-bg-layer-2, #2c2c2e);
	--did-text: var(--dsw-alias-label-primary, #d4d4d4);
	--did-text-secondary: var(--dsw-alias-label-secondary, #9a9a9a);
	--did-text-muted: var(--dsw-alias-label-tertiary, #6f6f6f);
	--did-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.15));
	--did-filehead-bg: var(--dsw-alias-bg-layer-3, rgba(128, 128, 128, 0.08));
	--did-empty-bg: color-mix(in srgb, var(--dsw-alias-label-primary, #808080) 5%, transparent);
	--did-code-font: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);

	/* add/remove palette: stat color, row fill, number-gutter fill, word chip.
	   Tints derive from the theme's success/error aliases via color-mix, so
	   they follow whatever colors the user's theme assigns. */
	--did-add-stat: var(--dsw-alias-state-success-primary, #3fb950);
	--did-add-row: color-mix(in srgb, var(--dsw-alias-state-success-primary, #3fb950) 9%, transparent);
	--did-add-gutter: color-mix(in srgb, var(--dsw-alias-state-success-primary, #3fb950) 18%, transparent);
	--did-add-word: color-mix(in srgb, var(--dsw-alias-state-success-primary, #3fb950) 30%, transparent);
	--did-del-stat: var(--dsw-alias-state-error-primary, #f85149);
	--did-del-row: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f85149) 9%, transparent);
	--did-del-gutter: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f85149) 18%, transparent);
	--did-del-word: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f85149) 30%, transparent);
}

.did-root {
	box-sizing: border-box;
	padding: 5px;
	margin: 4px 0 2px;
	border: 1px solid var(--did-border);
	border-radius: 6px;
	overflow: hidden;
	background: var(--did-surface);
	font-size: 12px;
	line-height: 19px;
}

.did-head {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 5px 8px;
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
	font-size: 11px;
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

.did-file + .did-file {
	border-top: 1px solid var(--did-border);
}

.did-filehead {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 3px 8px;
	background: var(--did-filehead-bg);
}

.did-filepath {
	color: var(--did-text-secondary);
	font-size: 11px;
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
	font-size: 11px;
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
	grid-template-columns: 38px minmax(0, 1fr) 38px minmax(0, 1fr);
}

.did-no {
	padding: 0 6px;
	color: var(--did-text-muted);
	opacity: 0.7;
	user-select: none;
	text-align: right;
	font-size: 10.5px;
	font-family: var(--did-code-font);
}

.did-code {
	padding: 0 8px;
	color: var(--did-text);
	min-width: 0;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	word-break: break-word;
	font-family: var(--did-code-font);
}

.did-delbg { background: var(--did-del-row); }
.did-insbg { background: var(--did-add-row); }
.did-no.did-delbg { background: var(--did-del-gutter); }
.did-no.did-insbg { background: var(--did-add-gutter); }
.did-delword { background: var(--did-del-word); border-radius: 2px; }
.did-insword { background: var(--did-add-word); border-radius: 2px; }
.did-void { background: var(--did-empty-bg); }

.did-more {
	padding: 4px 8px;
	color: var(--did-text-muted);
	font-size: 11px;
	border-top: 1px solid var(--did-border);
}

/* Plugins-page card: "Inline diff" accordion around the highlight control */
.did-card {
	border: 1px solid var(--did-border);
	background: var(--dsw-alias-bg-layer-3, rgba(128, 128, 128, 0.08));
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

.did-chev {
	flex: none;
	color: var(--did-text-muted);
	display: flex;
	transition: transform 0.16s;
}

.did-chevopen {
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
`;
		//#endregion

		//#region line diff (LCS with size cap)
		const LINE_DIFF_CAP = 1200;

		function splitLines(text) {
			return typeof text === "string" && text !== "" ? text.split("\n") : [];
		}

		// Strip the leading whitespace shared by every non-empty line on either
		// side. Lines indented deeper than the shared prefix keep their extra
		// indentation; blank lines become "".
		function stripSharedIndent(oldLines, newLines) {
			let sharedPrefix = null;
			for (const lines of [oldLines, newLines]) {
				for (const line of lines) {
					if (!line.trim()) continue;
					const indent = /^[\t ]*/.exec(line)[0];
					if (sharedPrefix === null) { sharedPrefix = indent; continue; }
					let keptLength = 0;
					const limit = Math.min(sharedPrefix.length, indent.length);
					while (keptLength < limit && sharedPrefix[keptLength] === indent[keptLength]) keptLength++;
					sharedPrefix = sharedPrefix.slice(0, keptLength);
					if (sharedPrefix === "") return { oldLines, newLines, indentChars: 0 };
				}
			}
			if (!sharedPrefix) return { oldLines, newLines, indentChars: 0 };
			const cut = (lines) => lines.map((line) =>
				line.startsWith(sharedPrefix) ? line.slice(sharedPrefix.length) : line.trim() ? line : "");
			return { oldLines: cut(oldLines), newLines: cut(newLines), indentChars: sharedPrefix.length };
		}

		// Diff two arrays into ops of { type: "equal" | "removed" | "added",
		// oldIndex?, newIndex? }. Returns null when either side exceeds cap;
		// callers then show the hunk as a whole-file replace.
		function lcsOps(oldItems, newItems, cap) {
			const oldCount = oldItems.length;
			const newCount = newItems.length;
			if (oldCount > cap || newCount > cap) return null;

			// commonLengths[row][column] holds the LCS length of the suffixes
			// starting at that cell; flattened with a row stride.
			const stride = newCount + 1;
			const commonLengths = new Int32Array((oldCount + 1) * stride);
			for (let oldIndex = oldCount - 1; oldIndex >= 0; oldIndex--) {
				const row = oldIndex * stride;
				const rowBelow = row + stride;
				for (let newIndex = newCount - 1; newIndex >= 0; newIndex--) {
					commonLengths[row + newIndex] = oldItems[oldIndex] === newItems[newIndex]
						? commonLengths[rowBelow + newIndex + 1] + 1
						: Math.max(commonLengths[rowBelow + newIndex], commonLengths[row + newIndex + 1]);
				}
			}

			const ops = [];
			let oldIndex = 0;
			let newIndex = 0;
			while (oldIndex < oldCount && newIndex < newCount) {
				if (oldItems[oldIndex] === newItems[newIndex]) {
					ops.push({ type: "equal", oldIndex, newIndex });
					oldIndex++;
					newIndex++;
				} else if (commonLengths[(oldIndex + 1) * stride + newIndex] >= commonLengths[oldIndex * stride + newIndex + 1]) {
					ops.push({ type: "removed", oldIndex });
					oldIndex++;
				} else {
					ops.push({ type: "added", newIndex });
					newIndex++;
				}
			}
			for (; oldIndex < oldCount; oldIndex++) ops.push({ type: "removed", oldIndex });
			for (; newIndex < newCount; newIndex++) ops.push({ type: "added", newIndex });
			return ops;
		}

		// Turn ops into side-by-side rows. Simultaneous removed/added runs pair
		// up as "modified" rows; leftovers stay one-sided.
		function buildRows(ops, oldLines, newLines) {
			const rows = [];
			let added = 0;
			let removed = 0;
			let opIndex = 0;
			while (opIndex < ops.length) {
				const op = ops[opIndex];
				if (op.type === "equal") {
					rows.push({
						kind: "context",
						leftNumber: op.oldIndex + 1,
						rightNumber: op.newIndex + 1,
						leftText: oldLines[op.oldIndex],
						rightText: newLines[op.newIndex],
					});
					opIndex++;
					continue;
				}
				const removedRun = [];
				const addedRun = [];
				while (opIndex < ops.length && ops[opIndex].type === "removed") { removedRun.push(ops[opIndex]); opIndex++; }
				while (opIndex < ops.length && ops[opIndex].type === "added") { addedRun.push(ops[opIndex]); opIndex++; }
				const pairedCount = Math.min(removedRun.length, addedRun.length);
				for (let pairIndex = 0; pairIndex < pairedCount; pairIndex++) {
					rows.push({
						kind: "modified",
						leftNumber: removedRun[pairIndex].oldIndex + 1,
						rightNumber: addedRun[pairIndex].newIndex + 1,
						leftText: oldLines[removedRun[pairIndex].oldIndex],
						rightText: newLines[addedRun[pairIndex].newIndex],
					});
				}
				for (let pairIndex = pairedCount; pairIndex < removedRun.length; pairIndex++) {
					rows.push({ kind: "removed", leftNumber: removedRun[pairIndex].oldIndex + 1, leftText: oldLines[removedRun[pairIndex].oldIndex] });
				}
				for (let pairIndex = pairedCount; pairIndex < addedRun.length; pairIndex++) {
					rows.push({ kind: "added", rightNumber: addedRun[pairIndex].newIndex + 1, rightText: newLines[addedRun[pairIndex].newIndex] });
				}
				removed += removedRun.length;
				added += addedRun.length;
			}
			return { rows, added, removed };
		}
		//#endregion

		//#region wire card extraction
		// Validate untrusted wire diffs into well-formed { path, oldText,
		// newText } hunks.
		function parseHunks(rawDiffs) {
			if (!Array.isArray(rawDiffs)) return null;
			const hunks = [];
			for (const candidate of rawDiffs) {
				if (candidate && typeof candidate === "object"
					&& typeof candidate.path === "string"
					&& typeof candidate.newText === "string"
					&& (candidate.oldText == null || typeof candidate.oldText === "string")) {
					hunks.push({
						path: candidate.path,
						oldText: candidate.oldText == null ? "" : candidate.oldText,
						newText: candidate.newText,
					});
				}
			}
			return hunks.length > 0 ? hunks : null;
		}

		// Settled calls read the result view (authoritative). An empty or
		// absent result falls back to the call-time view: new-file whole writes
		// and still-running calls only ever have that side.
		function extractHunks(block) {
			if (block == null || typeof block !== "object") return null;
			if (!("kind" in block)) {
				const callView = block.callView && block.callView.card === "diff" ? block.callView : null;
				return callView === null ? null : parseHunks(callView.diffs);
			}
			const resultView = block.resultView && block.resultView.card === "diff" ? block.resultView : null;
			const fromResult = resultView === null ? null : parseHunks(resultView.diffs);
			if (fromResult !== null) return fromResult;
			const callView = block.callView && block.callView.card === "diff" ? block.callView : null;
			return callView === null ? null : parseHunks(callView.diffs);
		}

		// Relativize to the session cwd, then to ~ under the host home.
		function relativePath(path, cwd, home) {
			if (cwd && path.startsWith(cwd + "/")) return path.slice(cwd.length + 1);
			if (home && path.startsWith(home + "/")) return "~" + path.slice(home.length);
			return path;
		}
		//#endregion

		//#region plugin preferences
		// Client-side view of the durable `inline-diff.highlight` ("words" |
		// "lines") and `inline-diff.indent` ("strip" | "keep") preferences.
		// apply() keeps these synced from the bound settings scope; diff cards
		// and the Plugins-page card both subscribe here. The literal strings
		// must match lib/index.js — the module-loader bundle cannot import
		// across halves.
		const SETTINGS_NAMESPACE = "inline-diff";
		const HIGHLIGHT_FIELD = "highlight";
		const HIGHLIGHT_WORDS = "words";
		const HIGHLIGHT_LINES = "lines";
		const INDENT_FIELD = "indent";
		const INDENT_STRIP = "strip";
		const INDENT_KEEP = "keep";

		let wordsMode = true;
		const wordsListeners = new Set();

		function getWordsMode() {
			return wordsMode;
		}

		function setWordsMode(enabled) {
			if (wordsMode === enabled) return;
			wordsMode = enabled;
			for (const listener of [...wordsListeners]) listener(enabled);
		}

		function onWordsMode(listener) {
			wordsListeners.add(listener);
			return () => { wordsListeners.delete(listener); };
		}

		let keepIndentMode = false;
		const keepIndentListeners = new Set();

		function getKeepIndent() {
			return keepIndentMode;
		}

		function setKeepIndent(enabled) {
			if (keepIndentMode === enabled) return;
			keepIndentMode = enabled;
			for (const listener of [...keepIndentListeners]) listener(enabled);
		}

		function onKeepIndent(listener) {
			keepIndentListeners.add(listener);
			return () => { keepIndentListeners.delete(listener); };
		}

		// Whether the Host serves the namespace (a card must leave no trace when
		// it does not) and accepts writes. Replaced only on change so React state
		// holders re-render exactly once per transition.
		let settingsState = { ready: false, writable: false };
		const settingsListeners = new Set();

		function getSettingsState() {
			return settingsState;
		}

		function adoptSettingsState(snapshot) {
			const next = { ready: snapshot.status === "ready", writable: snapshot.writable };
			if (next.ready === settingsState.ready && next.writable === settingsState.writable) return;
			settingsState = next;
			for (const listener of [...settingsListeners]) listener(next);
		}

		function onSettingsState(listener) {
			settingsListeners.add(listener);
			return () => { settingsListeners.delete(listener); };
		}
		//#endregion

		//#region i18n
		// Private message tables instead of entries in the locale service's
		// shared dictionary registry: registration there throws on duplicate
		// namespace/locale pairs and only two components consume copy here, so
		// lookups stay local. Fallback mirrors LocaleRuntime.lookup: active
		// locale, then English, then the key itself.
		const LOCALE_IDS = ["en", "zh"];
		const LOCALE_EN = "en";
		const LOCALE_ZH = "zh";

		const MESSAGES = {
			en: {
				"card.name": "Inline diff",
				"card.desc": "Diff highlighting and indentation for edit and write tool calls",
				"readonly.note": "Preferences are read-only in this session.",
				"highlight.title": "Diff highlighting",
				"highlight.words": "Words",
				"highlight.lines": "Lines only",
				"indent.title": "Common indentation",
				"indent.strip": "Strip",
				"indent.keep": "Keep",
				"indent.stripped.tooltip": "common indentation stripped ({count} chars)",
				"stats.files": "{count} files · ",
				"truncated.lines": "… {count} more lines (truncated)"
			},
			zh: {
				"card.name": "行内 Diff",
				"card.desc": "编辑与写入工具调用的差异高亮与缩进处理",
				"readonly.note": "偏好设置在当前会话中为只读。",
				"highlight.title": "差异高亮",
				"highlight.words": "词级",
				"highlight.lines": "仅整行",
				"indent.title": "公共缩进",
				"indent.strip": "去除",
				"indent.keep": "保留",
				"indent.stripped.tooltip": "已去除公共缩进（{count} 字符）",
				"stats.files": "{count} 个文件 · ",
				"truncated.lines": "… 另有 {count} 行（已截断）"
			}
		};

		// Active locale id, seeded from the browser the same way the locale
		// service seeds its provisional value before any Host preference is
		// known; apply() overwrites it from the service once composed.
		let activeLocale = detectLocale();
		const localeListeners = new Set();

		// First shipped language named by the browser, matched on the primary
		// subtag; English when nothing matches or window is absent.
		function detectLocale() {
			if (typeof window === "undefined") return LOCALE_EN;
			for (const tag of [...(navigator.languages ?? []), navigator.language]) {
				if (typeof tag !== "string") continue;
				const primary = tag.toLowerCase().split("-")[0];
				if (primary === LOCALE_ZH || primary === LOCALE_EN) return primary;
			}
			return LOCALE_EN;
		}

		function adoptLocale(id) {
			if (!LOCALE_IDS.includes(id) || activeLocale === id) return;
			activeLocale = id;
			for (const listener of [...localeListeners]) listener(id);
		}

		function onLocale(listener) {
			localeListeners.add(listener);
			return () => { localeListeners.delete(listener); };
		}

		// Translate for the active locale; {name} placeholders substitute
		// from params.
		function tr(key, params) {
			const template = MESSAGES[activeLocale]?.[key] ?? MESSAGES[LOCALE_EN][key] ?? key;
			if (!params) return template;
			return template.replace(/\{(\w+)\}/g, (match, name) =>
				name in params ? String(params[name]) : match);
		}
		//#endregion

		//#region intra-line word diff
		const TOKEN_DIFF_CAP = 400;

		function tokenize(line) {
			return line.match(/\w+|\s+|[^\w\s]/g) || [];
		}

		// Split a changed line pair into per-side text segments. Runs over
		// changed tokens come back marked changed; shared runs stay plain and
		// inherit the row tint.
		function wordSegments(oldLine, newLine) {
			const oldTokens = tokenize(oldLine);
			const newTokens = tokenize(newLine);
			const ops = lcsOps(oldTokens, newTokens, TOKEN_DIFF_CAP);
			if (ops === null) {
				return {
					left: [{ text: oldLine, changed: true }],
					right: [{ text: newLine, changed: true }],
				};
			}
			const collectSide = (side) => {
				const segments = [];
				for (const op of ops) {
					if (side === "left" ? op.type === "added" : op.type === "removed") continue;
					const text = side === "left" ? oldTokens[op.oldIndex] : newTokens[op.newIndex];
					const changed = op.type !== "equal";
					const lastSegment = segments[segments.length - 1];
					if (lastSegment && lastSegment.changed === changed) lastSegment.text += text;
					else segments.push({ text, changed });
				}
				return segments;
			};
			return { left: collectSide("left"), right: collectSide("right") };
		}
		//#endregion

		//#region rendering
		const MAX_ROWS = 600;
		const CARD_WIDTH_RATIO = 0.75;
		const FLOOR_GUTTER = 16;
		const MIN_CONTAINER_WIDTH = 60;

		function cell(className, text) {
			return react.createElement("div", { className }, text);
		}

		function segmentCell(className, segments, highlightClassName) {
			const children = segments.map((segment, index) => segment.changed
				? react.createElement("span", { className: highlightClassName, key: index }, segment.text)
				: segment.text);
			return react.createElement("div", { className }, children);
		}

		function pushRow(cells, row, wordDiff) {
			const leftNumber = row.leftNumber != null ? String(row.leftNumber) : "";
			const rightNumber = row.rightNumber != null ? String(row.rightNumber) : "";
			const leftText = row.leftText != null ? row.leftText : "";
			const rightText = row.rightText != null ? row.rightText : "";
			if (row.kind === "removed") {
				cells.push(cell("did-no did-delbg", leftNumber), cell("did-code did-delbg", leftText),
					cell("did-no did-void", ""), cell("did-code did-void", ""));
			} else if (row.kind === "added") {
				cells.push(cell("did-no did-void", ""), cell("did-code did-void", ""),
					cell("did-no did-insbg", rightNumber), cell("did-code did-insbg", rightText));
			} else if (row.kind === "modified") {
				if (!wordDiff) {
					cells.push(cell("did-no did-delbg", leftNumber), cell("did-code did-delbg", leftText),
						cell("did-no did-insbg", rightNumber), cell("did-code did-insbg", rightText));
					return;
				}
				const segments = wordSegments(leftText, rightText);
				cells.push(
					segmentCell("did-no did-delbg", [{ text: leftNumber, changed: false }], ""),
					segmentCell("did-code did-delbg", segments.left, "did-delword"),
					segmentCell("did-no did-insbg", [{ text: rightNumber, changed: false }], ""),
					segmentCell("did-code did-insbg", segments.right, "did-insword"));
			} else {
				cells.push(cell("did-no", leftNumber), cell("did-code", leftText),
					cell("did-no", rightNumber), cell("did-code", rightText));
			}
		}

		// Card width: CARD_WIDTH_RATIO of the conversation column, never
		// narrower than the reply-text column (--dsh-chat-content-width) minus
		// a gutter. Centered via margin so every card matches. Returns null on
		// tiny or missing containers.
		function computeCardGeometry(containerRect, containerStyle, element) {
			if (containerRect.width < MIN_CONTAINER_WIDTH) return null;
			const innerWidth = containerRect.width
				- (parseFloat(containerStyle.paddingLeft) || 0)
				- (parseFloat(containerStyle.paddingRight) || 0);
			const declaredWidth = parseFloat(containerStyle.getPropertyValue("--dsh-chat-content-width"));
			const floorWidth = declaredWidth > 0
				? Math.min(declaredWidth, Math.max(innerWidth - 2 * FLOOR_GUTTER, 0))
				: 0;
			const width = Math.max(Math.floor(containerRect.width * CARD_WIDTH_RATIO), floorWidth);
			const appliedMargin = parseFloat(element.style.marginLeft) || 0;
			const staticLeft = element.getBoundingClientRect().left - appliedMargin;
			const marginLeft = Math.round(containerRect.left + (containerRect.width - width) / 2 - staticLeft);
			return { width, marginLeft };
		}

		// Always-expanded split diff shown for edit/write tool calls.
		function InlineDiffRow(props) {
			const block = props && props.block;
			const toolName = (props && props.toolName) || "";
			const label = /write/i.test(toolName) ? "Write" : "Edit";
			const hunks = extractHunks(block);

			const rootRef = react.useRef(null);
			const [cardStyle, setCardStyle] = react.useState(null);
			react.useEffect(() => {
				const element = rootRef.current;
				if (!element || typeof ResizeObserver === "undefined") return;
				const container = element.closest("[data-conversation-scroll]");
				if (!container) return;
				const applyMeasure = () => {
					const geometry = computeCardGeometry(
						container.getBoundingClientRect(), getComputedStyle(container), element);
					if (geometry === null) return;
					setCardStyle((previous) =>
						previous && previous.width === geometry.width + "px" && previous.marginLeft === geometry.marginLeft + "px"
							? previous
							: { width: geometry.width + "px", marginLeft: geometry.marginLeft + "px" }
					);
				};
				applyMeasure();
				const observer = new ResizeObserver(applyMeasure);
				observer.observe(container);
				window.addEventListener("resize", applyMeasure);
				return () => {
					observer.disconnect();
					window.removeEventListener("resize", applyMeasure);
				};
			}, []);

			const [words, setWords] = react.useState(getWordsMode());
			react.useEffect(() => onWordsMode(setWords), []);
			const [keepIndent, setKeepIndent] = react.useState(getKeepIndent());
			react.useEffect(() => onKeepIndent(setKeepIndent), []);
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);

			if (hunks === null) {
				return react.createElement("div", { className: "did-root", ref: rootRef, style: cardStyle || undefined },
					react.createElement("div", { className: "did-head" },
						react.createElement("span", { className: "did-tool" }, label),
						react.createElement("span", { className: "did-filepath" }, "…")
					)
				);
			}

			const cwd = props.cwd, home = props.home, openFile = props.openFile;
			const children = [];
			let totalAdded = 0, totalRemoved = 0, renderedRows = 0, hiddenRows = 0;

			for (const hunk of hunks) {
				const oldLines = splitLines(hunk.oldText);
				const newLines = splitLines(hunk.newText);
				const stripped = keepIndent
					? { oldLines, newLines, indentChars: 0 }
					: stripSharedIndent(oldLines, newLines);
				let ops = lcsOps(stripped.oldLines, stripped.newLines, LINE_DIFF_CAP);
				if (ops === null) {
					ops = [];
					for (let oldIndex = 0; oldIndex < stripped.oldLines.length; oldIndex++) ops.push({ type: "removed", oldIndex });
					for (let newIndex = 0; newIndex < stripped.newLines.length; newIndex++) ops.push({ type: "added", newIndex });
				}
				const { rows, added, removed } = buildRows(ops, stripped.oldLines, stripped.newLines);
				totalAdded += added;
				totalRemoved += removed;

				const cells = [];
				for (const row of rows) {
					if (renderedRows >= MAX_ROWS) { hiddenRows++; continue; }
					pushRow(cells, row, words);
					renderedRows++;
				}

				const pathElement = typeof openFile === "function"
					? react.createElement("button", {
						type: "button", className: "did-path", title: hunk.path,
						onClick: () => openFile(hunk.path)
					}, relativePath(hunk.path, cwd, home))
					: react.createElement("span", { className: "did-filepath", title: hunk.path }, relativePath(hunk.path, cwd, home));

				children.push(react.createElement("div", { className: "did-file", key: hunk.path },
					react.createElement("div", { className: "did-filehead" },
						pathElement,
						react.createElement("span", { className: "did-stats" },
							stripped.indentChars > 0 ? react.createElement("span", {
								className: "did-indent",
								title: tr("indent.stripped.tooltip", { count: stripped.indentChars })
							}, "⇤ " + stripped.indentChars) : null,
							" ",
							react.createElement("span", { className: "did-addnum" }, "+" + added), " ",
							react.createElement("span", { className: "did-delnum" }, "−" + removed)
						)
					),
					react.createElement("div", { className: "did-grid" }, cells)
				));
			}

			if (hiddenRows > 0) {
				children.push(react.createElement("div", { className: "did-more" },
					tr("truncated.lines", { count: hiddenRows })));
			}

			return react.createElement("div", { className: "did-root", ref: rootRef, style: cardStyle || undefined },
				react.createElement("div", { className: "did-head" },
					react.createElement("span", { className: "did-tool" }, label),
					react.createElement("span", { className: "did-stats" },
						hunks.length > 1 ? tr("stats.files", { count: hunks.length }) : "",
						react.createElement("span", { className: "did-addnum" }, "+" + totalAdded), " ",
						react.createElement("span", { className: "did-delnum" }, "−" + totalRemoved)
					)
				),
				children
			);
		}
		//#endregion

		//#region plugin settings card
		// "Inline diff" card in Settings → Plugins: an accordion header over the
		// Words (token chips on paired rows) vs Lines-only (row tint) control and
		// the Strip vs Keep control for shared leading indentation. Reads through
		// the shared wordsMode/keepIndentMode subscriptions; writes go through the
		// injected setHighlight/setIndent, which echo optimistically and let the
		// scope subscription confirm. Hidden entirely while the Host does not
		// serve the namespace; buttons disable while the document is read-only.
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
			const [words, setWords] = react.useState(getWordsMode());
			react.useEffect(() => onWordsMode(setWords), []);
			const [keepIndent, setKeepIndent] = react.useState(getKeepIndent());
			react.useEffect(() => onKeepIndent(setKeepIndent), []);
			const [settings, setSettings] = react.useState(getSettingsState());
			react.useEffect(() => onSettingsState(setSettings), []);
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);
			const [open, setOpen] = react.useState(false);
			if (!settings.ready) return null;
			const writable = settings.writable
				&& typeof setHighlight === "function" && typeof setIndent === "function";
			const choose = writable ? setHighlight : () => {};
			const chooseIndent = writable ? setIndent : () => {};
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
					)
				) : null
			);
		}
		//#endregion

		//#region plugin body
		// Install the stylesheet, adopt the durable highlight/indent
		// preferences, then
		// shadow the stock edit/write keyed views and register the Plugins-page
		// card. Lowest priority renders, so unloading this plugin restores stock
		// rows.
		function apply(ctx) {
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-inline-diff";
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => tag.remove();
			}, "dsh-inline-diff: stylesheet");

			const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
			const adoptScope = () => {
				const snapshot = scope.getSnapshot();
				const section = snapshot.value;
				setWordsMode(section === undefined || section[HIGHLIGHT_FIELD] !== HIGHLIGHT_LINES);
				setKeepIndent(section !== undefined && section[INDENT_FIELD] === INDENT_KEEP);
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

			// Follow the GUI language while the optional locale service is
			// composed; without one, the browser-derived seed stands.
			ctx.inject(["locale"], (localeCtx) => {
				const locale = localeCtx.locale;
				const adoptServiceLocale = () => adoptLocale(locale.getLocale().active);
				adoptServiceLocale();
				localeCtx.effect(() => locale.subscribe(adoptServiceLocale),
					"dsh-inline-diff: locale adoption");
			});

			ctx.slots.inject("tool.call.toolview", function* () {
				yield ctx.slots.register({ name: "tool.call.toolview", key: "edit", priority: -1 }, InlineDiffRow);
				yield ctx.slots.register({ name: "tool.call.toolview", key: "write", priority: -1 }, InlineDiffRow);
			});
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: SETTINGS_NAMESPACE,
				inject: () => ({ setHighlight: writeHighlight, setIndent: writeIndent })
			}, DiffHighlightCard));
		}

		// Required host services.
		const inject = ["slots", "connection", "settingsScope"];
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
