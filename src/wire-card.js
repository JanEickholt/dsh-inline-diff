		//#region wire card extraction
		// Validate untrusted wire diffs into well-formed hunks.
		function parseHunks(rawDiffs) {
			if (!Array.isArray(rawDiffs)) return null;
			const hunks = [];
			for (const candidate of rawDiffs) {
				if (candidate && typeof candidate === "object"
					&& typeof candidate.path === "string"
					&& typeof candidate.newText === "string"
					&& (candidate.oldText == null || typeof candidate.oldText === "string")) {
					// 1-based serve-time anchors from the host half (lib/index.js);
					// undefined means "no trustworthy position for this side".
					hunks.push({
						path: candidate.path,
						oldText: candidate.oldText == null ? "" : candidate.oldText,
						newText: candidate.newText,
						oldStart: anchorStart(candidate.oldStart),
						newStart: anchorStart(candidate.newStart),
					});
				}
			}
			return hunks.length > 0 ? hunks : null;
		}

		// Intended diff derived from the call arguments: what a running call is
		// about to do, and the whole-file fallback for settled writes the
		// runtime recorded no applied diffs for.
		function intendedDiffFromCall(call, name) {
			if (call == null || typeof call !== "object") return null;
			let args;
			try {
				args = JSON.parse(call.argsRaw);
			} catch {
				return null;
			}
			if (args == null || typeof args !== "object" || Array.isArray(args)) return null;
			if (name === "write") {
				return typeof args.content === "string" && typeof args.file_path === "string"
					? { path: args.file_path, oldText: null, newText: args.content }
					: null;
			}
			if (name !== "edit") return null;
			if (typeof args.file_path !== "string" || args.file_path === "") return null;
			if (typeof args.old_string !== "string" || typeof args.new_string !== "string") return null;
			return { path: args.file_path, oldText: args.old_string || null, newText: args.new_string };
		}

		// Settled blocks carry the applied diffs in meta.diffs; running calls
		// (no kind yet) only have the intended diff from their arguments. Older
		// hosts annotated resultView/callView on the block instead — kept as
		// back-compat sources behind the current contract.
		function extractHunks(block) {
			if (block == null || typeof block !== "object") return null;
			if (!("kind" in block)) {
				const intended = intendedDiffFromCall(block, block.name);
				return intended === null ? null : [intended];
			}
			if (!block.isError) {
				const meta = block.meta;
				if (meta && typeof meta === "object" && !Array.isArray(meta)) {
					const fromMeta = parseHunks(meta.diffs);
					if (fromMeta !== null) return fromMeta;
				}
				const resultView = block.resultView && block.resultView.card === "diff" ? block.resultView : null;
				if (resultView !== null) {
					const fromResult = parseHunks(resultView.diffs);
					if (fromResult !== null) return fromResult;
				}
				const callView = block.callView && block.callView.card === "diff" ? block.callView : null;
				if (callView !== null) {
					const fromCall = parseHunks(callView.diffs);
					if (fromCall !== null) return fromCall;
				}
				// A successful write may record no applied diffs (whole-file
				// replace); fall back to its argument-derived diff, matching
				// the stock row.
				if (block.call && block.call.name === "write") {
					const intended = intendedDiffFromCall(block.call, "write");
					if (intended !== null) return [intended];
				}
				return null;
			}
			// A failed call shows the diff it attempted, dimmed: nothing was
			// applied, but a bare header row explains nothing.
			const attempted = intendedDiffFromCall(block.call, block.call && block.call.name);
			return attempted === null ? null : [attempted];
		}

		// Relativize to the session cwd, then to ~ under the host home.
		function relativePath(path, cwd, home) {
			if (cwd && path.startsWith(cwd + "/")) return path.slice(cwd.length + 1);
			if (home && path.startsWith(home + "/")) return "~" + path.slice(home.length);
			return path;
		}
		//#endregion
