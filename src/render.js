		//#region rendering
		const MAX_ROWS = 600;
		// Fold band: hunks longer than twice the visible-rows setting keep
		// that many rows on each end with the middle behind a click-to-reveal
		// bar. Needs a real middle: a bar for 1 hidden row trades a row for
		// a bar.
		const FOLD_MIN_HIDDEN = 4;
		const CARD_WIDTH_RATIO = 0.75;
		const MIN_CONTAINER_WIDTH = 60;

		function cell(className, text, num) {
			return react.createElement("div", { className },
				num === null ? text : [react.createElement("span", { className: "did-num", key: "num" }, num), text]);
		}

		// Row computation shared by rendering and the collapsed-card totals:
		// line ops plus the strip result the cells and stats both need.
		function computeHunkRows(hunk, keepIndent) {
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
			return { rows, added, removed, stripped };
		}

		// Syntax tokens with word-diff chips overlaid when the hunk's language
		// is known and syntax highlighting is on, plain text otherwise.
		// segments === null marks rows without word chips.
		function codeCell(className, text, lang, syntaxOn, segments, chipClass, num) {
			let children;
			if (syntaxOn && lang) {
				const tokens = lineTokens(text, lang);
				const parts = segments === null
					? tokens
					: mergeTokens(tokens, segments);
				children = parts.map((part, index) => {
					const partClass = part.changed
						? (part.cls ? part.cls + " " + chipClass : chipClass)
						: part.cls;
					return partClass === ""
						? part.text
						: react.createElement("span", { className: partClass, key: index }, part.text);
				});
			} else if (segments !== null) {
				children = segments.map((segment, index) => segment.changed
					? react.createElement("span", { className: chipClass, key: index }, segment.text)
					: segment.text);
			} else {
				children = text;
			}
			const parts = num === null
				? children
				: [react.createElement("span", { className: "did-num", key: "num" }, num),
					...(Array.isArray(children) ? children : [children])];
			return react.createElement("div", { className }, parts);
		}

		// Build one row's cell pair. Rows across the two column containers are
		// linked by data-ri (hover pairing, height sync).
		function pushCellPair(leftCells, rightCells, rowIndex, row, wordDiff, lang, syntaxOn, oldBase, newBase, numbersOn) {
			const leftText = row.leftText != null ? row.leftText : "";
			const rightText = row.rightText != null ? row.rightText : "";
			// Base + side index when anchored; otherwise window-relative 1..N
			// from the row's own side position (dsh-diff-stat's gutterNumbers
			// policy) so a gutter always renders. Numbers off drops the gutter.
			const leftNum = !numbersOn || row.oldIndex === undefined ? null
				: oldBase !== null ? oldBase + row.oldIndex : row.oldIndex + 1;
			const rightNum = !numbersOn || row.newIndex === undefined ? null
				: newBase !== null ? newBase + row.newIndex : row.newIndex + 1;
			let left;
			let right;
			if (row.kind === "removed") {
				// One-sided rows chip from the run-level diff (segments ===
				// null suppresses chips entirely).
				left = codeCell("did-code did-delbg",
					leftText, lang, syntaxOn, wordDiff && row.leftSegments !== undefined ? row.leftSegments : null, "did-delword", leftNum);
				right = cell("did-code did-void", "", null);
			} else if (row.kind === "added") {
				left = cell("did-code did-void", "", null);
				right = codeCell("did-code did-insbg",
					rightText, lang, syntaxOn, wordDiff && row.rightSegments !== undefined ? row.rightSegments : null, "did-insword", rightNum);
			} else if (row.kind === "modified") {
				if (!wordDiff) {
					left = codeCell("did-code did-delbg", leftText, lang, syntaxOn, null, "", leftNum);
					right = codeCell("did-code did-insbg", rightText, lang, syntaxOn, null, "", rightNum);
				} else {
					// Modified rows come only from mixed runs, whose runChips
					// is always defined-or-null, so leftSegments/rightSegments
					// are always set (null = chips suppressed).
					left = codeCell("did-code did-delbg", leftText, lang, syntaxOn, row.leftSegments, "did-delword", leftNum);
					right = codeCell("did-code did-insbg", rightText, lang, syntaxOn, row.rightSegments, "did-insword", rightNum);
				}
			} else {
				left = codeCell("did-code", leftText, lang, syntaxOn, null, "", leftNum);
				right = codeCell("did-code", rightText, lang, syntaxOn, null, "", rightNum);
			}
			const dataRi = { "data-ri": String(rowIndex) };
			// Keys must be the row's identity, not its render slot: every row
			// carries at least one unique side index (line-diff ops use each
			// old/new line at most once per hunk), so o{old}/n{new} is stable
			// even when a render skips or inserts rows. rowIndex stays for
			// data-ri pairing only.
			const rowKey = "o" + (row.oldIndex ?? "-") + "/n" + (row.newIndex ?? "-");
			leftCells.push(react.cloneElement(left, { ...dataRi, key: "l" + rowKey }));
			rightCells.push(react.cloneElement(right, { ...dataRi, key: "r" + rowKey }));
		}

		// Card width: CARD_WIDTH_RATIO of the conversation scroll area, capped
		// to the tool call's content row — the row tracks the chat column, so
		// the card follows the host's chat-width handle. Centered on that row
		// via margin so cards align with the message text. Null on tiny
		// containers.
		function computeCardGeometry(containerRect, contentRect, element) {
			if (containerRect.width < MIN_CONTAINER_WIDTH || contentRect.width <= 0) return null;
			const width = Math.min(
				Math.floor(containerRect.width * CARD_WIDTH_RATIO),
				Math.floor(contentRect.width));
			const appliedMargin = parseFloat(element.style.marginLeft) || 0;
			const staticLeft = element.getBoundingClientRect().left - appliedMargin;
			const marginLeft = Math.round(contentRect.left + (contentRect.width - width) / 2 - staticLeft);
			return { width, marginLeft };
		}

		// Always-expanded split diff shown for edit/write tool calls.
		function InlineDiffRow(props) {
			const block = props && props.block;
			const toolName = (props && props.toolName) || "";
			const label = /write/i.test(toolName) ? "Write" : "Edit";
			const hunks = react.useMemo(() => extractHunks(block), [block]);

			const rootRef = react.useRef(null);
			const [cardStyle, setCardStyle] = react.useState(null);
			// Layout effect: apply width/margin before paint so the initial
			// card never renders unmeasured and rewraps post-paint (same
			// autoscroll-latching drift as the height sync below).
			react.useLayoutEffect(() => {
				const element = rootRef.current;
				if (!element || typeof ResizeObserver === "undefined") return;
				const container = element.closest("[data-conversation-scroll]");
				if (!container) return;
				// The card is sized and centered against its content row (the
				// tool call's full-width box). Zero-width wrappers in between
				// are display: contents. Observing the row matters: the host's
				// chat-width handle resizes the message column without touching
				// the scroll container, so the container's observer never fires.
				let contentRow = element.parentElement;
				while (contentRow && contentRow !== container && contentRow.getBoundingClientRect().width <= 0) {
					contentRow = contentRow.parentElement;
				}
				if (!contentRow || contentRow === container) contentRow = container;
				const applyMeasure = () => {
					const geometry = computeCardGeometry(
						container.getBoundingClientRect(),
						contentRow.getBoundingClientRect(),
						element);
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
				if (contentRow !== container) observer.observe(contentRow);
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
			const [syntaxOn, setSyntaxOn] = react.useState(getSyntaxOn());
			react.useEffect(() => onSyntaxOn(setSyntaxOn), []);
			const [numbersOn, setNumbersOn] = react.useState(getNumbersOn());
			react.useEffect(() => onNumbersOn(setNumbersOn), []);
			const [foldRows, setFoldRowsState] = react.useState(getFoldRows());
			react.useEffect(() => onFoldRows(setFoldRowsState), []);
			const [foldKeep, setFoldKeepState] = react.useState(getFoldKeep());
			react.useEffect(() => onFoldKeep(setFoldKeepState), []);
			// Hunks the user toggled out of / into their folded state, keyed by
			// hunk index. Index keys survive the streaming settle (intended
			// diff -> applied hunks) well enough: a mis-keyed toggle at worst
			// expands or folds the wrong hunk once, never corrupts the grid.
			const [expandedFolds, setExpandedFolds] = react.useState(() => new Set());
			const toggleFold = (hunkIndex) => setExpandedFolds((prev) => {
				const next = new Set(prev);
				if (next.has(hunkIndex)) next.delete(hunkIndex);
				else next.add(hunkIndex);
				return next;
			});
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);

			// Row hover: mark the data-ri pair under the cursor. Delegated so
			// it costs two listeners per card instead of two per cell.
			const rootRefForHover = rootRef;
			const clearHover = () => {
				const rootEl = rootRefForHover.current;
				if (!rootEl) return;
				for (const el of rootEl.querySelectorAll(".did-hoverrow")) {
					el.classList.remove("did-hoverrow");
				}
			};
			const onGridOver = (event) => {
				const target = event.target;
				const hit = target && target.closest ? target.closest(".did-code") : null;
				const ri = hit && hit.dataset ? hit.dataset.ri : null;
				clearHover();
				if (!ri) return;
				const rootEl = rootRefForHover.current;
				if (!rootEl) return;
				for (const el of rootEl.querySelectorAll('[data-ri="' + ri + '"]')) {
					el.classList.add("did-hoverrow");
				}
			};

			// Wrapped lines make the two columns grow independently; pair the
			// data-ri cells' heights so counterpart rows stay level. Layout
			// effect on purpose: sizing must land pre-paint, in the same frame
			// as the committed rows. A post-paint shift makes scroll anchoring
			// move scrollTop above the viewport, which the conversation
			// scroller misreads as a reader scroll and latches autoscroll off
			// once the drift passes its 25px at-bottom threshold — large diffs
			// drift farthest, so they kill follow-scroll first.
			react.useLayoutEffect(() => {
				const rootEl = rootRef.current;
				if (!rootEl) return;
				const sync = () => {
					// Remeasuring clears every pair's min-height before reading
					// offsetHeight, so the forced layout in between sees the card
					// collapsed to its natural heights. A scroll container pinned
					// to the bottom clamps scrollTop into that collapsed layout
					// and never recovers — each streaming tick then strands the
					// bottom hundreds of px out of view and the drift latches
					// follow-scroll off (bigger edits collapse farther than the
					// viewport, so only they trip it). Holding the card's current
					// height across the measure keeps scrollHeight stable, so the
					// clamp never fires.
					rootEl.style.minHeight = rootEl.offsetHeight + "px";
					for (const grid of rootEl.querySelectorAll(".did-grid")) {
						const pairs = new Map();
						for (const cellEl of grid.querySelectorAll("[data-ri]")) {
							cellEl.style.minHeight = "";
							const ri = cellEl.dataset.ri;
							const slot = pairs.get(ri);
							if (slot) slot.push(cellEl);
							else pairs.set(ri, [cellEl]);
						}
						for (const pairCells of pairs.values()) {
							if (pairCells.length < 2) continue;
							const height = Math.max(pairCells[0].offsetHeight, pairCells[1].offsetHeight);
							if (height > 0) {
								for (const cellEl of pairCells) cellEl.style.minHeight = height + "px";
							}
						}
					}
					rootEl.style.minHeight = "";
				};
				sync();
				if (typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(sync);
				observer.observe(rootEl);
				return () => observer.disconnect();
			}, [hunks, keepIndent, words, syntaxOn]);

			// Selection is native browser behavior: each pane is one contiguous
			// column of DOM, so a vertical drag confined to a column stays
			// there on its own. A drag crossing the gap selects the raw
			// in-between DOM too — accepted trade-off for keeping selection
			// fully native (copy, double-click, shift-click all just work).

			// A failed card starts collapsed: the error result below the card
			// explains the failure, so the attempted diff is opt-in detail.
			const failed = !!(block && block.isError);
			const [attemptOpen, setAttemptOpen] = react.useState(false);
			const perHunk = react.useMemo(
				() => hunks === null ? [] : hunks.map((hunk) => computeHunkRows(hunk, keepIndent)),
				[hunks, keepIndent]);

			// Gutter bases for hunks the host could not stamp: one fenced file
			// read per distinct path, then a verbatim locate of each hunk. A
			// failed read/locate leaves that hunk's gutter blank. Keyed so a
			// settled block replacing the running one cannot reuse stale values.
			const hunkKey = hunks === null ? "" : hunks.map((hunk) =>
				hunk.path + "#" + (hunk.oldStart ?? "?") + ":" + (hunk.newStart ?? "?")
				+ ":" + hunk.oldText.length + ":" + hunk.newText.length
				+ ":" + hunk.newText.slice(0, 32)).join("|");
			// Settled hunks only, cached module-wide. A running call re-renders
			// every stream tick, and per-tick locate work there means an extra
			// post-paint commit during autoscroll — the exact churn that latches
			// follow-scroll off (see the height-sync note). It would also always
			// fail: the file does not contain the call's new_string yet.
			const settled = !!(block && typeof block === "object" && "kind" in block);
			const [located, setLocated] = react.useState(() => baseCache.get(hunkKey) ?? null);
			react.useEffect(() => {
				const cwd = props ? props.cwd : undefined;
				if (hunks === null || failed || !settled || cwd === undefined) return;
				if (baseCache.has(hunkKey)) return;
				const wanted = [];
				hunks.forEach((hunk, index) => {
					if (hunk.oldStart === undefined || hunk.newStart === undefined) wanted.push(index);
				});
				if (wanted.length === 0) return;
				let alive = true;
				void (async () => {
					const next = new Array(hunks.length).fill(null);
					const fileLinesByPath = new Map();
					for (const index of wanted) {
						const hunk = hunks[index];
						let fileLines = fileLinesByPath.get(hunk.path);
						if (fileLines === undefined) {
							const content = await readWorkspaceFile(hunk.path, cwd);
							fileLines = content === null ? null : splitLines(content);
							fileLinesByPath.set(hunk.path, fileLines);
						}
						if (fileLines === null) continue;
						next[index] = locateHunkBases(hunk, fileLines);
					}
					if (!alive) return;
					baseCache.set(hunkKey, { key: hunkKey, values: next });
					if (baseCache.size > BASE_CACHE_CAP) {
						const oldest = baseCache.keys().next();
						if (!oldest.done) baseCache.delete(oldest.value);
					}
					setLocated({ key: hunkKey, values: next });
				})();
				return () => { alive = false; };
			}, [hunkKey, block, props ? props.cwd : undefined, failed]);

			if (hunks === null) {
				return react.createElement("div", { className: "did-root" + (failed ? " did-failed" : ""), ref: rootRef, style: cardStyle || undefined },
					react.createElement("div", { className: "did-head" },
						react.createElement("span", { className: "did-tool" }, label),
						failed ? react.createElement("span", { className: "did-failedbadge" }, tr("failed.badge", { tool: label })) : null,
						react.createElement("span", { className: "did-filepath" }, "…")
					)
				);
			}

			const rootClass = "did-root" + (failed ? " did-failed" : "") + (numbersOn ? "" : " did-nonumbers");
			const cwd = props.cwd, home = props.home, openFile = props.openFile;
			let totalAdded = 0, totalRemoved = 0;
			for (const computed of perHunk) {
				totalAdded += computed.added;
				totalRemoved += computed.removed;
			}
			let renderedRows = 0, hiddenRows = 0;
			let rowCounter = 0;
			const children = [];

			// Per-hunk bases first: the gutter box must fit the LARGEST number
			// the card actually renders, so 5-digit files get a 5ch lane
			// instead of digits spilling toward the code.
			const hunkBases = hunks.map((hunk, hunkIndex) => {
				const locatedHunk = located !== null && located.key === hunkKey ? located.values[hunkIndex] : null;
				return {
					oldBase: hunk.oldStart !== undefined ? hunk.oldStart
						: locatedHunk !== null ? locatedHunk.oldBase : null,
					newBase: hunk.newStart !== undefined ? hunk.newStart
						: locatedHunk !== null ? locatedHunk.newBase : null,
				};
			});
			// The lane must NEVER change after a card's first paint: the late
			// locate re-render would rewrap the whole card (padding-left rides
			// the lane), and a post-paint height shift latches follow-scroll
			// off. Unknown bases therefore reserve a 4-digit lane — located
			// numbers for files up to 9999 lines then arrive with no lane
			// change — and the lane only ever grows, never shrinks.
			let maxNo = 0;
			let anyUnknown = false;
			hunks.forEach((hunk, hunkIndex) => {
				const { oldBase, newBase } = hunkBases[hunkIndex];
				for (const row of perHunk[hunkIndex].rows) {
					if (row.oldIndex !== undefined) {
						if (oldBase !== null) maxNo = Math.max(maxNo, oldBase + row.oldIndex);
						else anyUnknown = true;
					}
					if (row.newIndex !== undefined) {
						if (newBase !== null) maxNo = Math.max(maxNo, newBase + row.newIndex);
						else anyUnknown = true;
					}
				}
			});
			const wantedWidth = Math.max(anyUnknown ? 4 : 3, String(maxNo).length);
			const [laneWidth, setLaneWidth] = react.useState(() => wantedWidth);
			// Render-phase growth: re-renders pre-paint in the same commit, so
			// widening never produces a painted intermediate layout.
			const gutterWidth = wantedWidth > laneWidth
				? (setLaneWidth(wantedWidth), wantedWidth)
				: laneWidth;
			const numWidth = gutterWidth + "ch";

			for (let hunkIndex = 0; hunkIndex < hunks.length; hunkIndex++) {
				const hunk = hunks[hunkIndex];
				const { rows, stripped, added, removed } = perHunk[hunkIndex];
				const { oldBase, newBase } = hunkBases[hunkIndex];

				const lang = langFromPath(hunk.path);
				const leftCells = [];
				const rightCells = [];
				// Fold the middle behind a bar; the user's toggle is keyed by
				// hunk index. An expanded hunk keeps a collapse bar after its
				// first `keep` rows, so folding is reversible in place.
				// Truncation stays the outer policy and wins.
				const keep = Math.max(1, foldKeep);
				const foldable = foldRows && rows.length >= keep * 2 + FOLD_MIN_HIDDEN;
				const expanded = foldable && expandedFolds.has(hunkIndex);
				const foldHidden = foldable && !expanded ? rows.length - keep * 2 : 0;
				// Row budget this hunk could fill if it rendered everything
				// (expanded): what MAX_ROWS still allows at the hunk's start.
				const expandedReach = Math.min(rows.length, MAX_ROWS - renderedRows);
				for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
					const row = rows[rowIdx];
					if (renderedRows >= MAX_ROWS) { hiddenRows++; continue; }
					if (foldHidden > 0 && rowIdx >= keep && rowIdx < rows.length - keep) continue;
					pushCellPair(leftCells, rightCells, rowCounter++, row, words, lang, syntaxOn, oldBase, newBase, numbersOn);
					renderedRows++;
				}
				if ((foldHidden > 0 || expanded) && leftCells.length > 0) {
					// One bar per column, no data-ri: it must stay out of hover
					// pairing and height sync, which group by data-ri. Expanded
					// hunks wrap the collapsible range in a group element so the
					// collapse preview is pure CSS (`:hover` on the bar washes
					// its adjacent group) and can never outlive the pointer.
					// The bar only exists when the hunk rendered rows, and the
					// advertised count never exceeds what the bar actually
					// controls. MAX_ROWS can truncate inside the hunk:
					// expanded hunks wrap only the reachable cells; collapsed
					// bars promise the hidden rows that expanding would
					// actually render (budget minus the head).
					const at = Math.min(keep, leftCells.length);
					const count = expanded
						? Math.min(rows.length - keep * 2, leftCells.length - at, rightCells.length - at)
						: Math.min(rows.length - keep * 2, Math.max(0, expandedReach - keep));
					if (count > 0) {
						const plural = count === 1 ? ".one" : "";
						const label = tr(expanded ? "fold.hide" + plural : "fold.bar" + plural, { count });
						const bar = react.createElement("div", {
							// did-foldopen marks the expanded bar for the cross-column
							// collapse-preview wash: Chromium matches :hover inside a
							// flat :has() but NOT inside a nested :has() (verified on
							// the shipped engine), so the selector keys on this class.
							className: expanded ? "did-fold did-foldopen" : "did-fold",
							key: "f" + hunkIndex,
							onClick: () => toggleFold(hunkIndex),
							role: "button",
							tabIndex: 0,
							onKeyDown: (event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									toggleFold(hunkIndex);
								}
							},
						}, react.createElement("span", {
							className: expanded ? "did-fold-chevron did-fold-chevronopen" : "did-fold-chevron",
							"aria-hidden": "true",
						}, "▸"), label);
						if (expanded) {
							const leftRange = leftCells.splice(at, count);
							const rightRange = rightCells.splice(at, count);
							const leftGroup = react.createElement("div", { className: "did-foldrange", key: "fl" + hunkIndex }, ...leftRange);
							const rightGroup = react.createElement("div", { className: "did-foldrange", key: "fr" + hunkIndex }, ...rightRange);
							leftCells.splice(at, 0, bar, leftGroup);
							rightCells.splice(at, 0, bar, rightGroup);
						} else {
							leftCells.splice(at, 0, bar);
							rightCells.splice(at, 0, bar);
						}
					}
				}

				const pathElement = typeof openFile === "function"
					? react.createElement("button", {
						type: "button", className: "did-path", title: hunk.path,
						onClick: () => openFile(hunk.path)
					}, relativePath(hunk.path, cwd, home))
					: react.createElement("span", { className: "did-filepath", title: hunk.path }, relativePath(hunk.path, cwd, home));

				// Hunk ordinal namespaces the path: the host emits one diff per
				// applied hunk, all sharing the file path (scattered replacements
				// stay separate hunks), so a bare path collides.
				children.push(react.createElement("div", { className: "did-file", key: hunkIndex + ":" + hunk.path },
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
					react.createElement("div", {
						className: "did-grid",
						onMouseOver: onGridOver,
						onMouseLeave: clearHover,
					},
						react.createElement("div", { className: "did-col" }, leftCells),
						react.createElement("div", { className: "did-col" }, rightCells))
				));
			}

			if (hiddenRows > 0) {
				children.push(react.createElement("div", { className: "did-more", key: "more" },
					tr("truncated.lines", { count: hiddenRows })));
			}

			const toggleHead = (key) => react.createElement("div", {
				key,
				className: "did-head" + (failed ? " did-headtoggle" : ""),
				onClick: failed ? () => setAttemptOpen((open) => !open) : undefined,
				role: failed ? "button" : undefined,
				"aria-expanded": failed ? attemptOpen : undefined,
				tabIndex: failed ? 0 : undefined,
				onKeyDown: failed ? (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						setAttemptOpen((open) => !open);
					}
				} : undefined,
			},
				failed ? react.createElement("span", { className: "did-chev" }, "▸") : null,
				react.createElement("span", { className: "did-tool" }, label),
				failed ? react.createElement("span", { className: "did-failedbadge" }, tr("failed.badge", { tool: label })) : null,
				react.createElement("span", { className: "did-stats" },
					hunks.length > 1 ? tr("stats.files", { count: hunks.length }) : "",
					react.createElement("span", { className: "did-addnum" }, "+" + totalAdded), " ",
					react.createElement("span", { className: "did-delnum" }, "−" + totalRemoved)
				)
			);

			// Gutter width rides a custom property so both the number box and
			// every cell's reserved lane size to the card's largest number.
			const rootStyle = cardStyle === null
				? { "--did-num-w": numWidth }
				: { ...cardStyle, "--did-num-w": numWidth };

			if (failed && !attemptOpen) {
				return react.createElement("div", { className: rootClass, ref: rootRef, style: rootStyle },
					toggleHead("head"));
			}

			return react.createElement("div", { className: rootClass + (failed ? " did-open" : ""), ref: rootRef, style: rootStyle },
				toggleHead("head"),
				children
			);
		}
		//#endregion
