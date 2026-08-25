/**
 * Host half: registers the plugin's durable settings section so the client can
 * read and write the highlight preference through the settings domain. All
 * rendering lives in ./client (see "dsh" in package.json).
 */

import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";

//#region settings schema
/** Settings namespace owned by this plugin. */
const SETTINGS_NAMESPACE = settingsNamespace("inline-diff");

/** Field carrying the intra-line highlight mode. */
const HIGHLIGHT_FIELD = "highlight";

/** Durable schema; also the wire envelope the client scope validates against. */
const HighlightSettingsSchema = z.object({
	[HIGHLIGHT_FIELD]: z.union(["words", "lines"]).default("words"),
});
//#endregion

/**
 * Register the durable inline-diff section when the optional settings service
 * is composed; absent one, the client scope simply stays on defaults.
 * @param ctx - host cordis context.
 */
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(SETTINGS_NAMESPACE, HighlightSettingsSchema);
	});
}

export { apply };
