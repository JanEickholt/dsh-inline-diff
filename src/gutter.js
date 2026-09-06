		//#region gutter bases
		// Line numbers come from two sources, in order: the host's serve-time
		// oldStart/newStart stamps, then (stolen from dsh-diff-stat) a
		// best-effort locate of the hunk's post-image in the CURRENT file,
		// read through the host half's fenced read route. A hunk that cannot
		// be anchored falls back to window-relative 1..N numbering (also
		// dsh-diff-stat's policy), so the gutter always renders.

		/** Validate one wire anchor; anything non-finite/sub-1 is "absent". */
		function anchorStart(value) {
			return typeof value === "number" && Number.isFinite(value) && value >= 1 ? value : undefined;
		}

		/** Sole 0-based occurrence of `needle` in `fileLines`, else null. A
		 *  duplicated block has no single anchor and would number the wrong
		 *  region, so ambiguity refuses rather than guessing. */
		function locateOnce(needle, fileLines) {
			if (needle.length === 0) return null;
			let at = -1;
			outer: for (let i = 0; i + needle.length <= fileLines.length; i++) {
				for (let j = 0; j < needle.length; j++) {
					if (fileLines[i + j] !== needle[j]) continue outer;
				}
				if (at !== -1) return null;
				at = i;
			}
			return at === -1 ? null : at;
		}

		/** Per-side 1-based bases for one unstamped hunk: the post-image locates
		 *  the new side; the old side only when both sides start on the same
		 *  shared line. Deletion-only hunks anchor on their first old lines. */
		function locateHunkBases(hunk, fileLines) {
			const newLines = splitLines(hunk.newText);
			const oldLines = splitLines(hunk.oldText);
			let oldBase = null;
			let newBase = null;
			if (newLines.length > 0) {
				const at = locateOnce(newLines, fileLines);
				if (at !== null) {
					newBase = at + 1;
					if (oldLines.length > 0 && oldLines[0] === newLines[0]) oldBase = newBase;
				}
			} else if (oldLines.length > 0) {
				const at = locateOnce(oldLines.slice(0, Math.min(3, oldLines.length)), fileLines);
				if (at !== null) oldBase = at + 1;
			}
			return { oldBase, newBase };
		}

		/** LRU content cache: cwd-fenced path → {content, size}; one expanded
		 *  file ≈ one entry. Staleness needs the server, so a hit still POSTs
		 *  the read and reuses the cached text only while the served size
		 *  still matches; a changed file re-caches and re-locates. */
		const readCache = new Map();
		const READ_CACHE_CAP = 16;

		/** Read one workspace file through the host half's fenced route; null
		 *  when the host half is absent, the file is binary/unreadable. */
		async function readWorkspaceFile(path, cwd) {
			const key = (cwd ?? "") + "\0" + path;
			const hit = readCache.get(key);
			let content = null;
			let servedSize;
			try {
				const res = await fetch("/dsh-inline-diff/api/read", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ cwd, path }),
				});
				if (res.ok) {
					const payload = await res.json();
					if (payload && payload.kind === "text" && typeof payload.content === "string") {
						content = payload.content;
						if (typeof payload.size === "number") servedSize = payload.size;
					}
				}
			} catch { /* host absent or offline: blank gutters */ }
			if (content === null) {
				if (hit !== undefined) readCache.delete(key);
				return null;
			}
			// Without a served size the entry cannot be revalidated against
			// staleness; bypass the cache rather than risk stale line numbers.
			if (servedSize === undefined) return content;
			if (hit !== undefined && hit.size === servedSize) return hit.content;
			readCache.set(key, { content, size: servedSize });
			if (readCache.size > READ_CACHE_CAP) {
				const oldest = readCache.keys().next();
				if (!oldest.done) readCache.delete(oldest.value);
			}
			return content;
		}

		/** Resolved gutter bases per hunk set, keyed by the render-side hunkKey.
		 *  Lets a re-mounted card paint its numbers on the FIRST render instead
		 *  of mutating the DOM post-paint. */
		const baseCache = new Map();
		const BASE_CACHE_CAP = 64;
		//#endregion
