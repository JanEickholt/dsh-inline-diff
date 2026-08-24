# dsh-inline-diff

Always-expanded split diff view for `edit` / `write` tool calls in the [DeepSeek Harness](https://github.com/deepseek-ai) web GUI.

Shadows the stock collapsed tool rows: every file mutation renders inline in the chat flow as a side-by-side diff — line numbers, red/green highlighting, per-file `+N −N` stats, clickable path (host open-file), multi-file support. New-file writes render as pure green additions.

| | |
|---|---|
| Stock | collapsed row, click to expand a stacked diff |
| **This plugin** | always open, split view, zero clicks |

## Install

**GitHub dependency** (recommended):

```sh
# 1. add to <profile>/package.json dependencies
#    "dsh-inline-diff": "github:<you>/dsh-inline-diff"
pnpm install

# 2. add the composition row (see profile-cordis-patch.example.yml)
```

**Manual**: copy this package into `<profile>/node_modules/dsh-inline-diff/` and add the patch row.

**dshmarket**: publish to npm and list in [awesome-dsh-plugin](https://awesome-dsh-plugin.com) for one-click install.

Patch row (`cordis.patch.yml`):

```yaml
- insert:
    - id: inline-diff
      name: 'dsh-inline-diff'
```

Goes live on page refresh; the patch watcher hot-recomposes, no host restart needed.

## How it works

Pure client plugin — the host half is an empty stub. Registers into the keyed `tool.call.toolview` slot for `edit` and `write` at `priority: -1` (lowest priority renders, so the stock rows are shadowed; unloading the plugin restores them). Diff data comes from each call's own wire `card: 'diff'` view (`{path, oldText, newText}` hunks): settled calls read the result side, new-file whole writes fall back to the call-time diff, running calls show call-time state. No git, no file reads, no host communication.

To cover other mutation tool names, add one more `yield` line in `lib/client.js` → `apply()`.

## Tuning

Colors live in `lib/client.js` → the `CSS` template: `.did-delbg` / `.did-insbg` (row fill alpha), `.did-no.did-*bg` (number-gutter fill), `#3fb950` / `#f85149` (stat colors). Card width = widest line per side × 2, centered in the conversation column, capped at container width (`INSET`, `MIN` constants in `InlineDiffRow`).

## Limits

- LCS line diff capped at 1200 lines per side (beyond: whole-file replace display)
- 600 rendered rows per card, then a "… N more lines" footer
- Hunks are the wire's own fragments — very large writes may be summarized by the host before they reach the client

## License

MIT
