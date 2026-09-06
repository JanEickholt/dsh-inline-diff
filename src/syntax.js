		//#region syntax highlighting
		// Extension -> hljs language id, same coverage as dsh-solution-explorer;
		// undefined leaves the row plain.
		const EXT_LANG = {
			ts: "typescript", tsx: "typescript", mts: "typescript", cts: "typescript",
			js: "javascript", jsx: "javascript", mjs: "javascript", cjs: "javascript",
			json: "json", jsonc: "json",
			sh: "bash", bash: "bash", zsh: "bash",
			html: "xml", htm: "xml", vue: "xml", svg: "xml", xml: "xml",
			css: "css", scss: "scss", less: "less",
			py: "python", pycon: "python-repl",
			md: "markdown", markdown: "markdown",
			yaml: "yaml", yml: "yaml",
			diff: "diff", patch: "diff",
			c: "c", h: "c",
			cpp: "cpp", cc: "cpp", cxx: "cpp", hpp: "cpp", hh: "cpp",
			java: "java",
			go: "go",
			rs: "rust",
			cs: "csharp",
			gql: "graphql", graphql: "graphql",
			ini: "ini", toml: "ini",
			kt: "kotlin", kts: "kotlin",
			lua: "lua",
			mk: "makefile", mak: "makefile",
			m: "objectivec", mm: "objectivec",
			pl: "perl", pm: "perl",
			php: "php", phtml: "php-template",
			r: "r",
			rb: "ruby", rake: "ruby", gemspec: "ruby",
			sql: "sql",
			swift: "swift",
			vb: "vbnet",
			wat: "wasm",
			txt: "plaintext",
			svelte: "svelte",
		};

		function langFromPath(path) {
			const name = typeof path === "string" ? path.replace(/\\/g, "/").split("/").pop() ?? "" : "";
			const dot = name.lastIndexOf(".");
			if (dot < 0 || dot === name.length - 1) return undefined;
			return EXT_LANG[name.slice(dot + 1).toLowerCase()];
		}

		const TOKEN_CACHE_CAP = 4000;
		const tokenCache = new Map();

		function decodeEntities(text) {
			if (text.indexOf("&") < 0) return text;
			return text
				.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"")
				.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
		}

		// Flatten hljs HTML into ordered { text, cls } segments. hljs escapes
		// every literal '<', so tags are unambiguous; nested spans collapse
		// into the joined class list.
		function parseHljsHtml(html) {
			const segments = [];
			const classStack = [];
			let plain = "";
			let cursor = 0;
			const flush = () => {
				if (plain === "") return;
				const text = decodeEntities(plain);
				plain = "";
				const cls = classStack.filter(Boolean).join(" ");
				const last = segments[segments.length - 1];
				if (last && last.cls === cls) last.text += text;
				else segments.push({ text, cls });
			};
			while (cursor < html.length) {
				const open = html.indexOf("<", cursor);
				if (open < 0) { plain += html.slice(cursor); break; }
				if (open > cursor) plain += html.slice(cursor, open);
				const close = html.indexOf(">", open);
				if (close < 0) { plain += html.slice(open); break; }
				const tag = html.slice(open + 1, close);
				flush();
				if (tag.startsWith("/")) classStack.pop();
				else {
					const match = /class="([^"]*)"/.exec(tag);
					classStack.push(match === null ? "" : match[1]);
				}
				cursor = close + 1;
			}
			flush();
			return segments;
		}

		// Per-line like the explorer's diff column; multi-line constructs just
		// lose their token across the break.
		function lineTokens(line, lang) {
			const key = lang + "\u0000" + line;
			const cached = tokenCache.get(key);
			if (cached !== undefined) return cached;
			let html;
			try {
				html = hljs.highlight(line, { language: lang, ignoreIllegals: true }).value;
			} catch {
				html = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			}
			const tokens = parseHljsHtml(html);
			if (tokenCache.size >= TOKEN_CACHE_CAP) tokenCache.clear();
			tokenCache.set(key, tokens);
			return tokens;
		}

		// Overlay word-diff changed runs as [start, end) offsets onto syntax
		// tokens: tokens split at run boundaries so a span carries both its
		// hljs class and the word chip when it falls inside a change.
		function mergeTokens(tokens, segments) {
			const totalLength = tokens.reduce((total, token) => total + token.text.length, 0);
			const flags = new Uint8Array(totalLength);
			let offset = 0;
			for (const segment of segments) {
				if (segment.changed) flags.fill(1, offset, offset + segment.text.length);
				offset += segment.text.length;
			}
			const parts = [];
			let position = 0;
			for (const token of tokens) {
				const tokenStart = position;
				const tokenEnd = position + token.text.length;
				while (position < tokenEnd) {
					const flag = flags[position];
					let runEnd = position + 1;
					while (runEnd < tokenEnd && flags[runEnd] === flag) runEnd++;
					parts.push({
						text: token.text.slice(position - tokenStart, runEnd - tokenStart),
						cls: token.cls,
						changed: flag === 1,
					});
					position = runEnd;
				}
			}
			return parts;
		}
		//#endregion
