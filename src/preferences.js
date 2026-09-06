		//#region plugin preferences
		// Client-side view of the durable inline-diff prefs, synced by apply()
		// from the bound settings scope; both the diff cards and the Plugins
		// card subscribe here. Literal strings must match lib/index.js, since the
		// module-loader bundle cannot import across halves.
		const SETTINGS_NAMESPACE = "inline-diff";
		const HIGHLIGHT_FIELD = "highlight";
		const HIGHLIGHT_WORDS = "words";
		const HIGHLIGHT_LINES = "lines";
		const INDENT_FIELD = "indent";
		const INDENT_STRIP = "strip";
		const INDENT_KEEP = "keep";
		const SYNTAX_FIELD = "syntax";
		const SYNTAX_ON = "on";
		const SYNTAX_OFF = "off";
		const NUMBERS_FIELD = "numbers";
		const NUMBERS_ON = "on";
		const NUMBERS_OFF = "off";

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

		// Durable `inline-diff.syntax` ("on" | "off"); on by default, and the
		// whole tokenizer path is skipped while off.
		let syntaxOnMode = true;
		const syntaxOnListeners = new Set();

		function getSyntaxOn() {
			return syntaxOnMode;
		}

		function setSyntaxOn(enabled) {
			if (syntaxOnMode === enabled) return;
			syntaxOnMode = enabled;
			for (const listener of [...syntaxOnListeners]) listener(enabled);
		}

		function onSyntaxOn(listener) {
			syntaxOnListeners.add(listener);
			return () => { syntaxOnListeners.delete(listener); };
		}

		// Durable `inline-diff.numbers` ("on" | "off"); on by default. Off
		// drops the gutter entirely: no numbers, no reserved lane.
		let numbersOnMode = true;
		const numbersOnListeners = new Set();

		function getNumbersOn() {
			return numbersOnMode;
		}

		function setNumbersOn(enabled) {
			if (numbersOnMode === enabled) return;
			numbersOnMode = enabled;
			for (const listener of [...numbersOnListeners]) listener(enabled);
		}

		function onNumbersOn(listener) {
			numbersOnListeners.add(listener);
			return () => { numbersOnListeners.delete(listener); };
		}

		// Whether the Host serves the namespace (a card must leave no trace
		// when it does not) and accepts writes. Replaced only on change so
		// subscribers re-render exactly once per transition.
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
