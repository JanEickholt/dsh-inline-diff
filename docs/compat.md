# DSH client compatibility

`dsh-inline-diff` supports three DSH client release lines. The plugin ships one
bundle and detects the host at runtime; nothing here requires upgrading the
client.

| Line | npm dist-tag | Supported |
| --- | --- | --- |
| `0.1.5` | (older stable) | yes |
| `0.1.7` | — | yes |
| `0.2.0` | `latest` / `next` | yes |

## Contract diff

Everything the plugin touches, and what changed between the lines.

| Surface | `0.1.5` | `0.1.7` / `0.2.0` | How the plugin copes |
| --- | --- | --- | --- |
| `window.__ModuleLoader__.load({ id, factory })` | `factory(require)` | same, plus optional `chunk`; `require.async(spec)` added | unchanged — the plugin's factory already takes a bare `require` |
| `ctx.slots.inject` / `ctx.slots.register` | present | identical | unchanged |
| `tool.call.toolview` owner props | `{ callId, toolName, block: ToolCallBlock, cwd, home, openFile, loadImage, inspect }` | `ToolCallCommonProps & { phase, block }`; `block` is `PreparingToolCall` \| `StartedToolCall` \| `ToolResultNode`; adds `useDisclosure` | `extractHunks` rejects a `preparing` block explicitly (no `argsRaw`) instead of relying on a `JSON.parse` throw |
| `settings.plugin.item` slot | exists | **removed** | never filed on a 0.1.7+ host |
| `settings.plugins.tab` slot | — | `kind: 'list'`, options `id` / `order` / `label` | never filed on a 0.1.5 host |
| `ctx.settingsScope.bind({ namespace })` | exists | **removed** | replaced by `ctx.configForms.get(entryId)` |
| Settings form surface | `SettingsScope<T>` | `ConfigForm<T>` | identical (`getSnapshot` / `subscribe` / `set` / `unset`), so one adapter covers both |
| Host `ctx.settings` | `SettingsProvider.register(ns, schema, options)` | `SettingsForms.configure({ auto }, fiber)` | `apply` branches on which method exists |
| Host settings schema | argument to `register` | package-root `Config` export; the namespace is the profile entry id | both shipped; the namespace is the existing `inline-diff` entry id |
| Form-editable fields | any | fields must be `.volatile()` | built only when the resolved schemastery has `.volatile` (3.18.4+) |
| `schemastery` | `^3.18.2` | `~3.18.4` | peer range `^3.18.1` already admits both |
| `webServer.register({ kind: 'prefix', path, handler })` | present | identical | unchanged |
| `output.presentationMeta(args, value)` | present | identical | unchanged |
| tools registry `createSuccessResult` | present | identical | unchanged |

`0.1.7` is the breaking line. `0.1.7` → `0.2.0` changed no contract this plugin
uses.

## Detection

`inject` names cannot be version-conditional: cordis leaves a plugin whose
`inject` names an absent service dormant, and reading an un-injected property off
a plugin context throws `cannot get property "…" without inject`. The plugin
therefore injects only `slots` and probes the ancestor context for the settings
transport:

```js
const host = Object.getPrototypeOf(ctx);          // un-injected ancestor
host.configForms?.get?.(ns) ?? host.settingsScope?.bind?.({ namespace: ns });
```

The probe also picks the card's slot, because the transport and the slot were
renamed together:

| Probe finds | Card is filed on |
| --- | --- |
| `configForms` | `settings.plugins.tab` |
| `settingsScope` | `settings.plugin.item` |
| neither | no card; diffs still render on defaults |

Filing **both** names would be wrong, not merely redundant: DSH's slot core
throws `slot "…" is not declared` from `register`, so a name the host does not
own is a hard error, not an inert registration. The `inject` call and the
registration it yields are both guarded, and a failure is reported through
`ctx.logger.warn` — a host that mounts the card late, or drops the extension
point, loses the settings card and keeps its diffs.

Host side takes the mirror image: both `register` and `configure` are probed on
the injected `settings` service, so a wrong-version host takes the other branch
instead of failing to load.

## Deliberate limits

- The fenced read route and the `presentationMeta` anchor are the plugin's
  reason to touch `tools` at all. Both contracts are stable across all three
  lines, so no adapter is needed there.
- `dsh-settings` is a peer dependency with range `>=0.1.1-rc.2 <0.3.0-0`; the
  `<0.2.0-0` bound that shipped with 1.8.0 excluded the current `latest` line.
