		//#region i18n
		// Private message tables rather than the locale service's shared
		// dictionary: registration there throws on duplicate namespace/locale
		// pairs and only two components read this copy. Fallback mirrors
		// LocaleRuntime.lookup: active locale, English, then the key itself.
		const LOCALE_IDS = ["en", "zh"];
		const LOCALE_EN = "en";
		const LOCALE_ZH = "zh";

		const MESSAGES = {
			en: {
				"card.name": "Inline diff",
				"card.desc": "Syntax, diff highlighting and indentation for edit and write tool calls",
				"readonly.note": "Preferences are read-only in this session.",
				"highlight.title": "Diff highlighting",
				"highlight.words": "Words",
				"highlight.lines": "Lines only",
				"indent.title": "Common indentation",
				"indent.strip": "Strip",
				"indent.keep": "Keep",
				"indent.stripped.tooltip": "common indentation stripped ({count} chars)",
				"syntax.title": "Syntax highlighting",
				"syntax.on": "On",
				"syntax.off": "Off",
				"numbers.title": "Line numbers",
				"numbers.on": "On",
				"numbers.off": "Off",
				"wallpaper.title": "Wallpaper glass",
				"wallpaper.on": "On",
				"wallpaper.off": "Off",
				"stats.files": "{count} files · ",
				"failed.badge": "{tool} failed — not applied",
				"truncated.lines": "… {count} more lines (truncated)"
			},
			zh: {
				"card.name": "行内 Diff",
				"card.desc": "编辑与写入工具调用的语法高亮、差异高亮与缩进处理",
				"readonly.note": "偏好设置在当前会话中为只读。",
				"highlight.title": "差异高亮",
				"highlight.words": "词级",
				"highlight.lines": "仅整行",
				"indent.title": "公共缩进",
				"indent.strip": "去除",
				"indent.keep": "保留",
				"indent.stripped.tooltip": "已去除公共缩进（{count} 字符）",
				"syntax.title": "语法高亮",
				"syntax.on": "开",
				"syntax.off": "关",
				"numbers.title": "行号",
				"numbers.on": "开",
				"numbers.off": "关",
				"wallpaper.title": "壁纸玻璃",
				"wallpaper.on": "开",
				"wallpaper.off": "关",
				"stats.files": "{count} 个文件 · ",
				"failed.badge": "{tool} 失败 — 未应用",
				"truncated.lines": "… 另有 {count} 行（已截断）"
			}
		};

		// Active locale id, seeded from the browser like the locale service
		// seeds its provisional value; apply() overwrites once composed.
		let activeLocale = detectLocale();
		const localeListeners = new Set();

		// First shipped language named by the browser, matched on the primary subtag.
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

		function tr(key, params) {
			const template = MESSAGES[activeLocale]?.[key] ?? MESSAGES[LOCALE_EN][key] ?? key;
			if (!params) return template;
			return template.replace(/\{(\w+)\}/g, (match, name) =>
				name in params ? String(params[name]) : match);
		}
		//#endregion
