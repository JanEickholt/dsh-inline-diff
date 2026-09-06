		//#region line diff (LCS with size cap)
		const LINE_DIFF_CAP = 1200;

		function splitLines(text) {
			return typeof text === "string" && text !== "" ? text.split("\n") : [];
		}

		// Strip the leading whitespace shared by every non-empty line; deeper
		// indents keep their extra depth, blank lines become "".
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
		// oldIndex?, newIndex? }. Returns null past cap; callers fall back to
		// a whole-file replace.
		function lcsOps(oldItems, newItems, cap) {
			const oldCount = oldItems.length;
			const newCount = newItems.length;
			if (oldCount > cap || newCount > cap) return null;

			// commonLengths[row][column]: LCS length of the suffix starting at
			// that cell, flattened with a row stride.
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

		//#region run pairing
		// Modified rows pair across each removed/added run by token similarity
		// rather than run order: an insertion placed above an edited line
		// otherwise word-chips the edited line against the first comment while
		// its true counterpart renders as a pure addition. Token-multiset
		// scores (same tokenizer as the word chips); weak matches stay
		// one-sided. Stats keep counting full runs, so badges stay true.
		const PAIR_SIMILARITY_MIN = 0.5;
		// Containment rule: a line embedded in a longer counterpart — a call
		// wrapped in a spread or conditional — is mostly shared, but Dice
		// punishes the length asymmetry. Pair on high overlap when the
		// smaller side carries enough tokens that bare brackets cannot match.
		const PAIR_CONTAINMENT_MIN = 0.8;
		const PAIR_MIN_TOKENS = 4;
		// Candidate matrix cap: past it, fall back to run-order pairing.
		const PAIR_MATRIX_CAP = 4096;

		function countTokens(line) {
			const tokens = tokenize(line);
			const counts = new Map();
			for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
			return { counts, size: tokens.length };
		}

		// Shared-token count over multisets — the Dice numerator, reused by
		// the containment checks.
		function sharedTokens(oldTokens, newTokens) {
			let shared = 0;
			for (const [token, count] of oldTokens.counts) {
				const other = newTokens.counts.get(token);
				if (other !== undefined) shared += Math.min(count, other);
			}
			return shared;
		}

		// Score for pairing two lines: 0 means "leave one-sided". Dice over
		// token multisets first; otherwise containment (shared over the
		// smaller side) with a token floor.
		function linePairScore(oldTokens, newTokens) {
			const minSize = Math.min(oldTokens.size, newTokens.size);
			if (minSize === 0) return 0;
			const shared = sharedTokens(oldTokens, newTokens);
			const dice = (2 * shared) / (oldTokens.size + newTokens.size);
			if (dice >= PAIR_SIMILARITY_MIN) return dice;
			const containment = shared / minSize;
			if (containment >= PAIR_CONTAINMENT_MIN && minSize >= PAIR_MIN_TOKENS) return containment;
			return 0;
		}

		// Greedy best-similarity matching, emitted in old-line order. Returns
		// [oldIndex, newIndex] pairs; unpaired lines stay one-sided.
		function pairRunLines(oldLines, removedRun, newLines, addedRun) {
			// A 1:1 run cannot mispair: exactly one candidate exists per side,
			// so the insertion-steal failure mode the score gate guards against
			// does not apply. Stack the two lines as one modified row whatever
			// the score says, matching side-by-side convention (a replacement
			// renders its del/add on the same row) and saving a row of height.
			if (removedRun.length === 1 && addedRun.length === 1) {
				return [[removedRun[0].oldIndex, addedRun[0].newIndex]];
			}
			if (removedRun.length * addedRun.length > PAIR_MATRIX_CAP) {
				const pairs = [];
				const pairedCount = Math.min(removedRun.length, addedRun.length);
				for (let index = 0; index < pairedCount; index++) {
					pairs.push([removedRun[index].oldIndex, addedRun[index].newIndex]);
				}
				return pairs;
			}
			const oldTokens = removedRun.map((op) => countTokens(oldLines[op.oldIndex]));
			const newTokens = addedRun.map((op) => countTokens(newLines[op.newIndex]));
			const candidates = [];
			for (let oldSide = 0; oldSide < removedRun.length; oldSide++) {
				for (let newSide = 0; newSide < addedRun.length; newSide++) {
					const score = linePairScore(oldTokens[oldSide], newTokens[newSide]);
					if (score > 0) candidates.push({ oldSide, newSide, score });
				}
			}
			// Merge anchor: an old line folded into a multi-line block
			// contains several fragments, so each scores as a candidate and
			// greedy would anchor the pair at the highest-scoring one —
			// usually a mid-block continuation. A statement rewrite reads
			// head-first, so keep only the run's first contained line as the
			// counterpart (score stays the best of the set).
			const containedByOld = new Map();
			for (const candidate of candidates) {
				const minSize = Math.min(oldTokens[candidate.oldSide].size, newTokens[candidate.newSide].size);
				if (minSize < PAIR_MIN_TOKENS) continue;
				const containment = sharedTokens(oldTokens[candidate.oldSide], newTokens[candidate.newSide]) / minSize;
				if (containment < PAIR_CONTAINMENT_MIN) continue;
				const sides = containedByOld.get(candidate.oldSide);
				if (sides) sides.push(candidate);
				else containedByOld.set(candidate.oldSide, [candidate]);
			}
			for (const [oldSide, sides] of containedByOld) {
				if (sides.length < 2) continue;
				const anchor = sides.reduce((a, b) => (b.newSide < a.newSide ? b : a));
				const best = Math.max(...sides.map((side) => side.score));
				for (const candidate of candidates) {
					if (candidate.oldSide !== oldSide) continue;
					if (candidate === anchor) candidate.score = Math.max(candidate.score, best);
					else candidate.drop = true;
				}
			}
			candidates.sort((a, b) => b.score - a.score);
			const takenOld = new Uint8Array(removedRun.length);
			const takenNew = new Uint8Array(addedRun.length);
			const pairs = [];
			for (const candidate of candidates) {
				if (candidate.drop === true) continue;
				if (takenOld[candidate.oldSide] === 1 || takenNew[candidate.newSide] === 1) continue;
				const oldIndex = removedRun[candidate.oldSide].oldIndex;
				const newIndex = addedRun[candidate.newSide].newIndex;
				// Keep the matching monotone: a pair crossing an accepted one
				// would render one column's rows out of file order.
				let crosses = false;
				for (const [acceptedOld, acceptedNew] of pairs) {
					if ((oldIndex < acceptedOld) !== (newIndex < acceptedNew)) { crosses = true; break; }
				}
				if (crosses) continue;
				takenOld[candidate.oldSide] = 1;
				takenNew[candidate.newSide] = 1;
				pairs.push([oldIndex, newIndex]);
			}
			pairs.sort((a, b) => a[0] - b[0]);
			return pairs;
		}
		//#endregion

		// Pair removed/added runs as "modified" rows by similarity; leftovers
		// stay one-sided.
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
						leftText: oldLines[op.oldIndex],
						rightText: newLines[op.newIndex],
						oldIndex: op.oldIndex,
						newIndex: op.newIndex,
					});
					opIndex++;
					continue;
				}
				const removedRun = [];
				const addedRun = [];
				while (opIndex < ops.length && ops[opIndex].type === "removed") { removedRun.push(ops[opIndex]); opIndex++; }
				while (opIndex < ops.length && ops[opIndex].type === "added") { addedRun.push(ops[opIndex]); opIndex++; }
				const pairs = pairRunLines(oldLines, removedRun, newLines, addedRun);
				const pairedOld = new Set(pairs.map((pair) => pair[0]));
				const pairedNew = new Set(pairs.map((pair) => pair[1]));
				// Run-level chips: one token diff across the whole changed
				// block. Pure runs (one side empty) leave undefined and
				// oversized runs null — both render with no chips downstream.
				// Modified rows only exist for mixed runs, where runChips is
				// always defined-or-null.
				const runChips = removedRun.length > 0 && addedRun.length > 0
					? runChipSegments(
						removedRun.map((op) => oldLines[op.oldIndex]),
						addedRun.map((op) => newLines[op.newIndex]))
					: undefined;
				const removedPos = new Map(removedRun.map((op, index) => [op.oldIndex, index]));
				const addedPos = new Map(addedRun.map((op, index) => [op.newIndex, index]));
				// Emit so both columns read top-down: a leftover line falls
				// before the pair it precedes on its own side, so gutters
				// never run backwards within a changed block.
				let removedAt = 0;
				let addedAt = 0;
				const emitRemoved = (op) => {
					rows.push({
						kind: "removed",
						leftText: oldLines[op.oldIndex],
						oldIndex: op.oldIndex,
						leftSegments: runChips === null ? null : runChips?.left[removedPos.get(op.oldIndex)],
					});
				};
				const emitAdded = (op) => {
					rows.push({
						kind: "added",
						rightText: newLines[op.newIndex],
						newIndex: op.newIndex,
						rightSegments: runChips === null ? null : runChips?.right[addedPos.get(op.newIndex)],
					});
				};
				for (const [oldIndex, newIndex] of pairs) {
					while (removedAt < removedRun.length && removedRun[removedAt].oldIndex < oldIndex) {
						if (!pairedOld.has(removedRun[removedAt].oldIndex)) emitRemoved(removedRun[removedAt]);
						removedAt++;
					}
					while (addedAt < addedRun.length && addedRun[addedAt].newIndex < newIndex) {
						if (!pairedNew.has(addedRun[addedAt].newIndex)) emitAdded(addedRun[addedAt]);
						addedAt++;
					}
					rows.push({
						kind: "modified",
						leftText: oldLines[oldIndex],
						rightText: newLines[newIndex],
						oldIndex,
						newIndex,
						leftSegments: runChips === undefined ? undefined : runChips === null ? null : runChips.left[removedPos.get(oldIndex)],
						rightSegments: runChips === undefined ? undefined : runChips === null ? null : runChips.right[addedPos.get(newIndex)],
					});
				}
				for (; removedAt < removedRun.length; removedAt++) {
					if (!pairedOld.has(removedRun[removedAt].oldIndex)) emitRemoved(removedRun[removedAt]);
				}
				for (; addedAt < addedRun.length; addedAt++) {
					if (!pairedNew.has(addedRun[addedAt].newIndex)) emitAdded(addedRun[addedAt]);
				}
				removed += removedRun.length;
				added += addedRun.length;
			}
			return { rows, added, removed };
		}
		//#endregion
