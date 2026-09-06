// Concatenates the src/ blocks into lib/client.js, the single self-contained
// file DSH loads. Blocks are stored verbatim — wrapper indentation (2 tabs on
// code lines, 0-1 tabs inside template literals) is preserved as-is, so the
// emitted file is byte-identical to a hand-maintained one. Edit src/, never
// lib/client.js.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = (name) => readFileSync(join(here, "..", "src", name), "utf8").replace(/\n+$/, "");

// Order mirrors the module body: vendor first (defines didHljsVendor), then
// stylesheet, pure helpers, and finally the React rendering + plugin body.
const blocks = [
	"vendor-hljs.js",
	"style.js",
	"line-diff.js",
	"wire-card.js",
	"gutter.js",
	"preferences.js",
	"i18n.js",
	"word-diff.js",
	"syntax.js",
	"render.js",
	"settings-card.js",
	"plugin-body.js",
];

writeFileSync(
	join(here, "..", "lib", "client.js"),
	[src("header.js"), ...blocks.map(src), src("footer.js")].join("\n\n") + "\n",
);
console.log("built lib/client.js");
