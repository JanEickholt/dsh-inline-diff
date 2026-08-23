window.__ModuleLoader__.load({
	id: "dsh-inline-diff",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region stylesheet
		const CSS = `
.did-root{font-family:var(--dsw-font-mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);font-size:12px;line-height:19px;margin:4px 0 2px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));border-radius:6px;overflow:hidden;background:var(--dsw-alias-bg-layer-1,transparent)}
.did-head{display:flex;align-items:center;gap:8px;padding:5px 8px}
.did-tool{color:var(--dsw-alias-label-secondary,#9a9a9a);font-size:10px;font-weight:700;letter-spacing:.6px;text-transform:uppercase}
.did-stats{margin-left:auto;color:var(--dsw-alias-label-tertiary,#6f6f6f);font-size:11px;font-family:var(--dsw-font-ui,system-ui,sans-serif);white-space:nowrap}
.did-addnum{color:#3fb950;font-weight:600}
.did-delnum{color:#f85149;font-weight:600}
.did-file+.did-file{border-top:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25))}
.did-filehead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:3px 8px;background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.06))}
.did-filepath{color:var(--dsw-alias-label-secondary,#9a9a9a);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
button.did-path{appearance:none;border:0;background:none;color:var(--dsw-alias-label-secondary,#9a9a9a);font:inherit;font-size:11px;padding:1px 6px;border-radius:4px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;max-width:70%}
button.did-path:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary,#e6e6e6)}
.did-grid{display:grid;grid-template-columns:38px minmax(0,1fr) 38px minmax(0,1fr)}
.did-no{text-align:right;padding:0 6px;color:var(--dsw-alias-label-tertiary,#6f6f6f);opacity:.7;user-select:none;font-size:10.5px}
.did-code{padding:0 8px;color:var(--dsw-alias-label-primary,#d4d4d4);white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;min-width:0}
.did-delbg{background:rgba(248,81,73,.13)}
.did-insbg{background:rgba(63,185,80,.13)}
.did-void{background:rgba(128,128,128,.05)}
.did-more{padding:4px 8px;color:var(--dsw-alias-label-tertiary,#6f6f6f);font-size:11px;font-family:var(--dsw-font-ui,system-ui,sans-serif);border-top:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2))}
`;
		//#endregion

		//#region line diff (LCS with cap)
		const DIFF_CAP = 1200;

		function splitLines(text) {
			return typeof text === "string" && text !== "" ? text.split("\n") : [];
		}

		/**
		 * Line-level LCS diff. Returns an op list of {t:'eq'|'dl'|'in', ai?, bi?},
		 * or null when either side exceeds DIFF_CAP (caller falls back to a
		 * whole-file replace).
		 */
		function lcsOps(a, b) {
			const n = a.length, m = b.length;
			if (n > DIFF_CAP || m > DIFF_CAP) return null;
			const w = m + 1;
			const dp = new Int32Array((n + 1) * w);
			for (let i = n - 1; i >= 0; i--) {
				const row = i * w, below = (i + 1) * w;
				for (let j = m - 1; j >= 0; j--) {
					dp[row + j] = a[i] === b[j]
						? dp[below + j + 1] + 1
						: Math.max(dp[below + j], dp[row + j + 1]);
				}
			}
			const ops = [];
			let i = 0, j = 0;
			while (i < n && j < m) {
				if (a[i] === b[j]) { ops.push({ t: "eq", ai: i, bi: j }); i++; j++; }
				else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) { ops.push({ t: "dl", ai: i }); i++; }
				else { ops.push({ t: "in", bi: j }); j++; }
			}
			while (i < n) { ops.push({ t: "dl", ai: i }); i++; }
			while (j < m) { ops.push({ t: "in", bi: j }); j++; }
			return ops;
		}

		/**
		 * Pair del/ins runs into side-by-side rows: aligned mod rows first, then
		 * leftover pure-del and pure-ins rows. Returns rows plus true add/del
		 * counts.
		 */
		function splitRows(ops, a, b) {
			const rows = [];
			let add = 0, del = 0, k = 0;
			while (k < ops.length) {
				const op = ops[k];
				if (op.t === "eq") {
					rows.push({ kind: "ctx", lno: op.ai + 1, rno: op.bi + 1, ltext: a[op.ai], rtext: b[op.bi] });
					k++;
					continue;
				}
				const dels = [], ins = [];
				while (k < ops.length && ops[k].t === "dl") { dels.push(ops[k]); k++; }
				while (k < ops.length && ops[k].t === "in") { ins.push(ops[k]); k++; }
				const pairs = Math.min(dels.length, ins.length);
				for (let p = 0; p < pairs; p++) {
					rows.push({ kind: "mod", lno: dels[p].ai + 1, rno: ins[p].bi + 1, ltext: a[dels[p].ai], rtext: b[ins[p].bi] });
				}
				for (let p = pairs; p < dels.length; p++) rows.push({ kind: "del", lno: dels[p].ai + 1, ltext: a[dels[p].ai] });
				for (let p = pairs; p < ins.length; p++) rows.push({ kind: "ins", rno: ins[p].bi + 1, rtext: b[ins[p].bi] });
				del += dels.length;
				add += ins.length;
			}
			return { rows, add, del };
		}
		//#endregion

		//#region wire card extraction (mirrors the stock diff-card model)
		/** Narrow an untrusted diffs array to well-formed {path, oldText, newText} hunks. */
		function narrowDiffs(raw) {
			if (!Array.isArray(raw)) return null;
			const out = [];
			for (const h of raw) {
				if (h && typeof h === "object"
					&& typeof h.path === "string"
					&& typeof h.newText === "string"
					&& (h.oldText == null || typeof h.oldText === "string")) {
					out.push({ path: h.path, oldText: h.oldText == null ? "" : h.oldText, newText: h.newText });
				}
			}
			return out.length > 0 ? out : null;
		}

		/**
		 * Derive the hunks for a tool call block, or null when this call carries
		 * no diff card. Settled calls read the result side (authoritative); an
		 * empty/absent result hunk set falls back to the call-time diff (new-file
		 * whole writes); running calls read the call-time diff directly.
		 */
		function extractDiffs(block) {
			if (block == null || typeof block !== "object") return null;
			if (!("kind" in block)) {
				const call = block.callView && block.callView.card === "diff" ? block.callView : null;
				return call === null ? null : narrowDiffs(call.diffs);
			}
			const result = block.resultView && block.resultView.card === "diff" ? block.resultView : null;
			const fromResult = result === null ? null : narrowDiffs(result.diffs);
			if (fromResult !== null) return fromResult;
			const call = block.callView && block.callView.card === "diff" ? block.callView : null;
			return call === null ? null : narrowDiffs(call.diffs);
		}

		/** Relativize an absolute path to the session cwd, then ~ for the host home. */
		function relPath(p, cwd, home) {
			if (cwd && p.startsWith(cwd + "/")) return p.slice(cwd.length + 1);
			if (home && p.startsWith(home + "/")) return "~" + p.slice(home.length);
			return p;
		}
		//#endregion

		//#region rendering
		const MAX_ROWS = 600;

		function cell(cls, text) {
			return react.createElement("div", { className: cls }, text);
		}

		function pushRow(cells, row) {
			const lno = row.lno != null ? String(row.lno) : "";
			const rno = row.rno != null ? String(row.rno) : "";
			const ltext = row.ltext != null ? row.ltext : "";
			const rtext = row.rtext != null ? row.rtext : "";
			if (row.kind === "del") {
				cells.push(cell("did-no did-delbg", lno), cell("did-code did-delbg", ltext), cell("did-no did-void", ""), cell("did-code did-void", ""));
			} else if (row.kind === "ins") {
				cells.push(cell("did-no did-void", ""), cell("did-code did-void", ""), cell("did-no did-insbg", rno), cell("did-code did-insbg", rtext));
			} else if (row.kind === "mod") {
				cells.push(cell("did-no did-delbg", lno), cell("did-code did-delbg", ltext), cell("did-no did-insbg", rno), cell("did-code did-insbg", rtext));
			} else {
				cells.push(cell("did-no", lno), cell("did-code", ltext), cell("did-no", rno), cell("did-code", rtext));
			}
		}

		/**
		 * Always-expanded split diff for edit/write calls. Owner payload comes
		 * from the keyed tool.call.toolview slot: { callId, toolName, block,
		 * cwd, home, openFile, inspect }.
		 */
		function InlineDiffRow(props) {
			const block = props && props.block;
			const toolName = (props && props.toolName) || "";
			const label = /write/i.test(toolName) ? "Write" : "Edit";
			const diffs = extractDiffs(block);

			if (diffs === null) {
				return react.createElement("div", { className: "did-root" },
					react.createElement("div", { className: "did-head" },
						react.createElement("span", { className: "did-tool" }, label),
						react.createElement("span", { className: "did-filepath" }, "…")
					)
				);
			}

			const cwd = props.cwd, home = props.home, openFile = props.openFile;
			const children = [];
			let totalAdd = 0, totalDel = 0, rendered = 0, remaining = 0;

			for (const h of diffs) {
				const a = splitLines(h.oldText), b = splitLines(h.newText);
				let ops = lcsOps(a, b);
				if (ops === null) {
					ops = [];
					for (let i = 0; i < a.length; i++) ops.push({ t: "dl", ai: i });
					for (let j = 0; j < b.length; j++) ops.push({ t: "in", bi: j });
				}
				const built = splitRows(ops, a, b);
				totalAdd += built.add;
				totalDel += built.del;

				const cells = [];
				for (const row of built.rows) {
					if (rendered >= MAX_ROWS) { remaining++; continue; }
					pushRow(cells, row);
					rendered++;
				}

				const pathEl = typeof openFile === "function"
					? react.createElement("button", {
						type: "button", className: "did-path", title: h.path,
						onClick: () => openFile(h.path)
					}, relPath(h.path, cwd, home))
					: react.createElement("span", { className: "did-filepath", title: h.path }, relPath(h.path, cwd, home));

				children.push(react.createElement("div", { className: "did-file", key: h.path },
					react.createElement("div", { className: "did-filehead" },
						pathEl,
						react.createElement("span", { className: "did-stats" },
							react.createElement("span", { className: "did-addnum" }, "+" + built.add), " ",
							react.createElement("span", { className: "did-delnum" }, "−" + built.del)
						)
					),
					react.createElement("div", { className: "did-grid" }, cells)
				));
			}

			if (remaining > 0) {
				children.push(react.createElement("div", { className: "did-more" }, "… " + remaining + " more lines (truncated)"));
			}

			return react.createElement("div", { className: "did-root" },
				react.createElement("div", { className: "did-head" },
					react.createElement("span", { className: "did-tool" }, label),
					react.createElement("span", { className: "did-stats" },
						diffs.length > 1 ? diffs.length + " files · " : "",
						react.createElement("span", { className: "did-addnum" }, "+" + totalAdd), " ",
						react.createElement("span", { className: "did-delnum" }, "−" + totalDel)
					)
				),
				children
			);
		}
		//#endregion

		//#region plugin body
		/**
		 * Client plugin body: install the stylesheet, then shadow the stock
		 * edit/write keyed views at lower priority (lowest renders; unloading
		 * this plugin restores the stock rows).
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-inline-diff";
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => tag.remove();
			}, "dsh-inline-diff: stylesheet");
			ctx.slots.inject("tool.call.toolview", function* () {
				yield ctx.slots.register({ name: "tool.call.toolview", key: "edit", priority: -1 }, InlineDiffRow);
				yield ctx.slots.register({ name: "tool.call.toolview", key: "write", priority: -1 }, InlineDiffRow);
			});
		}

		/** Required services: the client slot registry. */
		const inject = ["slots"];
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
