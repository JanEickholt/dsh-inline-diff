		//#region intra-line word diff

		// Unicode-aware: an ASCII \w splits "größe" or 变量 into per-letter
		// tokens, and without the u flag an emoji splits into its two
		// surrogate halves, which a chip boundary can then tear apart into
		// two unrenderable lone surrogates.
		function tokenize(line) {
			return line.match(/[\p{L}\p{M}\p{N}_]+|\s+|[^\p{L}\p{M}\p{N}_\s]/gu) || [];
		}

		// Run-level chip diff: a changed block is diffed as one token stream,
		// so tokens that survive anywhere in the run stay chip-free even when
		// their row pairs with a different sibling line (a one-line removal
		// replaced by a multi-line block otherwise chips the surviving prefix
		// against whichever line it paired with). Pure runs — nothing on the
		// opposite side — skip chips: there is nothing to match against, and
		// a full-line chip on a pure add/remove just doubles the row tint.
		// Returns per-line segment arrays, or null when the run is too big.
		const RUN_CHIP_CAP = 1200;
		// Word chips cost one token-table cell per old x new token pair of
		// every mixed run, so a hunk rewriting long lines wholesale spends
		// tens of ms on chips alone. Over this many cells per hunk it keeps
		// the line-level tint only. Picked from the 8,763 real cards in the
		// session logs: per-hunk p99 is ~255k cells, and 500k drops chips on
		// 26 hunks (25 cards) and cuts all chip work by ~30%, all of it from
		// the slowest cards.
		const HUNK_CHIP_CELL_CAP = 500000;

		// Cells the hunk's chip diffs would fill (runs past the per-side cap
		// fill none: they return null before the table).
		function hunkChipCells(ops, oldLines, newLines) {
			let cells = 0;
			let opIndex = 0;
			while (opIndex < ops.length) {
				if (ops[opIndex].type === "equal") { opIndex++; continue; }
				let oldTokens = 0;
				let newTokens = 0;
				while (opIndex < ops.length && ops[opIndex].type === "removed") oldTokens += tokenize(oldLines[ops[opIndex++].oldIndex]).length;
				while (opIndex < ops.length && ops[opIndex].type === "added") newTokens += tokenize(newLines[ops[opIndex++].newIndex]).length;
				if (oldTokens <= RUN_CHIP_CAP && newTokens <= RUN_CHIP_CAP) cells += oldTokens * newTokens;
			}
			return cells;
		}

		function runChipSegments(oldRunLines, newRunLines) {
			const oldSide = oldRunLines.map((line) => tokenize(line));
			const newSide = newRunLines.map((line) => tokenize(line));
			const oldTokens = oldSide.flat();
			const newTokens = newSide.flat();
			const ops = lcsOps(oldTokens, newTokens, RUN_CHIP_CAP);
			if (ops === null) return null;
			const oldChanged = new Uint8Array(oldTokens.length).fill(1);
			const newChanged = new Uint8Array(newTokens.length).fill(1);
			for (const op of ops) {
				if (op.type !== "equal") continue;
				oldChanged[op.oldIndex] = 0;
				newChanged[op.newIndex] = 0;
			}
			const collect = (tokens, changed, perLine) => {
				const lines = [];
				let offset = 0;
				for (const lineTokens of perLine) {
					const segments = [];
					let hasContent = false;
					let hasUnchanged = false;
					for (const text of lineTokens) {
						// Whitespace never chips: an indent-only chip paints a
						// full-width bar ahead of the text (GitHub's word diff
						// ignores whitespace too).
						const isChanged = changed[offset] === 1 && !/^\s+$/.test(text);
						if (!/^\s+$/.test(text)) {
							hasContent = true;
							if (!isChanged) hasUnchanged = true;
						}
						const last = segments[segments.length - 1];
						if (last && last.changed === isChanged) last.text += text;
						else segments.push({ text, changed: isChanged });
						offset++;
					}
					// A line with no surviving token gains nothing from a
					// full-line chip — that just doubles the row tint.
					if (hasContent && !hasUnchanged) {
						for (const segment of segments) segment.changed = false;
					}
					lines.push(segments);
				}
				return lines;
			};
			return {
				left: collect(oldTokens, oldChanged, oldSide),
				right: collect(newTokens, newChanged, newSide),
			};
		}
		//#endregion
