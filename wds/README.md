# WDS — Web Design System

A dependency-free, framework-free component library (plain HTML/CSS/JS + a
handful of Web Components) for building consistent, modern admin/app UIs:
resource panels, tables, accordions, toasts, modals, drawers, navigation,
trees, lists, stat cards, and more.

No build step. No npm. Works on any static host (Cloudflare Pages, GitHub
Pages, `file://`, whatever).

## Quick start

Copy this whole `wds/` folder into your project, then add two tags:

```html
<link rel="stylesheet" href="/wds/wds.css">
<script type="module" src="/wds/wds.js"></script>
```

`wds.js` **must** be loaded as `type="module"` (or otherwise deferred) —
several components read their light-DOM children on connect and assume the
document has already finished parsing.

Open [docs/index.html](docs/index.html) in a browser for a full live
component gallery with copy-paste markup.

Open [examples/index.html](examples/index.html) for full page archetypes
(company website, resizable IDE-style panels, team chat) built entirely
from WDS components.

## Structure

```
wds/
  tokens/tokens.css          design tokens (color, spacing, type, radius, shadow, motion, z-index)
  base/                      reset.css, base.css (typography), utilities.css (layout helpers)
  icons/                     wds-icon.js (inline SVG icon set) + icons.css
  components/<name>/         one folder per component: <name>.css and/or wds-<name>.js
  docs/index.html            living style guide / component gallery (dogfoods the system)
  examples/<name>/           full page application archetypes built from WDS components
  wds.css                    single CSS entry point (@imports everything)
  wds.js                     single JS entry point (registers all custom elements, exposes `WDS`)
```

## Conventions

- **Tokens only.** Never hardcode colors, spacing, radii, shadows, etc. in
  app code — always reference `var(--wds-*)` from [tokens/tokens.css](tokens/tokens.css).
- **Prefix.** All classes/elements are prefixed `wds-` to avoid collisions
  with app-specific CSS.
- **Two implementation styles, on purpose:**
  - Simple, static things (buttons, badges, inputs, cards, lists, empty
    states, skeletons) are **plain CSS classes on plain HTML** — no JS
    required.
  - Interactive/stateful things (modal, drawer, toast, accordion, tabs,
    menu, table sorting/selection, tree, resource panel, pagination) are
    **Web Components** (`<wds-*>`), mostly light-DOM (so they stay easy to
    style and inspect) except `<wds-modal>`/`<wds-drawer>`/`<wds-toast-container>`
    which use Shadow DOM + native `<dialog>`/Popover for focus-trapping and
    stacking.
- **Imperative helpers** live on `window.WDS` (also available as named
  exports from `wds.js`): `WDS.toast`, `WDS.confirm`, `WDS.theme`.

## Theming

Light/dark is driven by `[data-wds-theme]` on `<html>`:

- No attribute / `"auto"` → follows `prefers-color-scheme`
- `"light"` / `"dark"` → forced

```js
import { theme } from "/wds/wds.js";
theme.set("dark");   // or "light" / "auto"
theme.toggle();
```

To avoid a flash of the wrong theme, add a tiny **blocking** inline script
in `<head>` before your stylesheet, ahead of `wds.js` loading:

```html
<script>
  const t = localStorage.getItem("wds-theme");
  if (t) document.documentElement.setAttribute("data-wds-theme", t);
</script>
```

## Updating the design system

This repo is the single source of truth. When a project needs a new
variant or component:

1. Make the change here first (add/extend a component, keep it
   token-driven and consistent with existing patterns).
2. Update [docs/index.html](docs/index.html) with a usage example.
3. Bump [CHANGELOG.md](CHANGELOG.md).
4. Re-copy the updated `wds/` folder into consuming projects.

Do not fork component files inside a consuming project — fix them here and
re-vendor instead, or the whole point of "consistent everywhere" breaks
down.

See the `web-design-system` agent skill for the full component API
reference and copy-paste snippets used when generating frontend code.
