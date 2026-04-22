---
"@questpie/admin": patch
---

Improve admin form sidebar responsiveness and add file-first admin chrome/theme customization paths.

- Keep heavy dialog/sheet components unmounted until they are opened.
- Reuse already-fetched collection schema across validation and server action hooks to avoid duplicate observers and schema processing.
- Reduce lock-refresh event listener overhead during form editing.
- Add optional non-animated/non-overlay sheet rendering for nested sidebars.
- Add file-first chrome overrides for the sidebar brand area, sidebar nav rows, and the shared auth layout.
- Export stable override prop types from `@questpie/admin/client` for custom sidebar and auth components.
- Split admin CSS into reusable `base.css`, `brutal.css`, and `soft.css` presets while keeping `index.css` as the brutal default.
