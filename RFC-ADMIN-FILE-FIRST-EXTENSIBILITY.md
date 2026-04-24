# RFC: Minimal File-First Admin Extensibility

> Status: **Proposed**
> Date: 2026-04-21

---

## Summary

Keep QUESTPIE admin white-labeling and extensibility **minimal** and aligned with the existing **file-first + codegen discovery** model.

This RFC proposes:

1. Keep the **admin shell** owned by the end-user app.
2. Keep `questpie/server/config/admin.ts` focused on **structure** (`sidebar`, `dashboard`, `branding.name`, locale).
3. Reuse the existing `questpie/admin/*` discovery model as the primary client-side extension surface.
4. Reuse the existing `components` and `pages` categories instead of adding a new `chrome` category.
5. Split admin CSS into a small set of explicit theme exports (`base`, `brutal`, `soft`) instead of adding a server-side theme subsystem.

The goal is not to add a new branding engine. The goal is to make the existing architecture easier to use, easier to document, and more clearly file-first.

---

## Why This RFC Exists

The repo already points toward the right architecture:

1. The server is file-convention driven.
2. The admin client is also file-convention driven via the `admin-client` codegen target.
3. End-user apps already own the admin route shell and CSS.

Concrete evidence in the current codebase:

| Concern                                                                                        | Current file(s)                                                    |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Server admin config discovery                                                                  | `packages/admin/src/server/plugin.ts`                              |
| Admin client target categories (`views`, `components`, `fields`, `pages`, `widgets`, `blocks`) | `packages/admin/src/server/plugin.ts`                              |
| Generic admin client codegen merge                                                             | `packages/admin/src/server/codegen/admin-client-template.ts`       |
| Cross-target validation                                                                        | `packages/admin/src/server/codegen/projection-validator.ts`        |
| Example app-owned admin shell                                                                  | `examples/tanstack-barbershop/src/routes/admin.tsx`                |
| Example app-owned admin CSS                                                                    | `examples/tanstack-barbershop/src/admin.css`                       |
| Example server-side admin structure                                                            | `examples/tanstack-barbershop/src/questpie/server/config/admin.ts` |

The missing piece is not a new subsystem. The missing piece is a clearer and more explicit story for:

1. which changes belong in the app shell,
2. which changes belong in `config/admin.ts`,
3. which changes belong in `questpie/admin/*`,
4. which client-side override points should be treated as first-class.

---

## Problem Statement

Today, the admin already supports:

1. `sidebar` configuration on the server,
2. `dashboard` configuration on the server,
3. custom client `pages`,
4. custom client `views`,
5. custom client `widgets`,
6. custom client `fields`,
7. custom client `components`,
8. app-level route and CSS composition.

But the story is still blurry in three places:

1. The docs imply that more of white-labeling lives in `config/admin.ts` than actually should.
2. There is no documented file-first pattern for chrome overrides like sidebar brand or shared auth layout.
3. Theme customization exists in practice, but the package does not expose a clean preset/export story.

There is also a real docs mismatch today:

1. `apps/docs/content/docs/workspace/branding.mdx` describes `favicon` and full appearance as if they belong in `config/admin.ts`.
2. The real architecture in `examples/tanstack-barbershop/src/routes/admin.tsx` and `examples/tanstack-barbershop/src/admin.css` shows that these concerns naturally live in the end-user app shell.

---

## Goals

1. Stay minimal.
2. Fit the existing file-first/codegen model.
3. Avoid adding a new admin runtime subsystem.
4. Avoid duplicating seams that already exist.
5. Make the architecture easy to explain in docs and easy to scaffold via skills.

---

## Non-Goals

This RFC does **not** propose:

1. a new server-side branding engine,
2. a `theme` object in `config/admin.ts`,
3. favicon handling in admin DTOs,
4. a new `chrome` codegen target category,
5. a JS runtime theme manager inside `@questpie/admin`,
6. replacing app-owned route composition.

---

## Locked Decisions

1. **End-user apps own the admin shell.**
2. **`config/admin.ts` remains structure-first, not shell-first.**
3. **File-first client overrides must reuse existing discovery categories where possible.**
4. **We do not add a new `chrome` category if `components` and `pages` already solve the problem.**
5. **Theme selection is done by CSS imports in the app, not by server config.**

---

## How This Fits File-First and Codegen Discovery

This proposal intentionally follows the existing codegen model instead of introducing a parallel mechanism.

### 1. Server structure already has a file-first singleton

The admin plugin already discovers `config/admin.ts` from the server root via:

- `packages/admin/src/server/plugin.ts`

This remains the right place for:

1. `sidebar`
2. `dashboard`
3. `branding.name`
4. minimal admin locale metadata

### 2. Client rendering already has file-first registries

The `admin-client` target already discovers these categories under `questpie/admin/`:

- `views`
- `components`
- `fields`
- `pages`
- `widgets`
- `blocks`

Source of truth:

- `packages/admin/src/server/plugin.ts`
- `packages/admin/src/server/codegen/admin-client-template.ts`

This is already the correct place for white-label rendering changes.

### 3. Extra client-only keys already fit the current validator model

The projection validator only checks that server-defined `blocks`, `views`, and `components` have matching client registrations.

It does **not** reject extra client-only keys.

Source of truth:

- `packages/admin/src/server/codegen/projection-validator.ts`

That means client-only override components like `sidebarBrand` can live in `questpie/admin/components/` without requiring a matching server component definition.

### 4. This means we do not need a new category

Because `components` and `pages` are already discovered and merged into the generated admin client object, the most file-first and minimal solution is:

1. reuse `questpie/admin/pages/*.tsx` for full-page overrides,
2. reuse `questpie/admin/components/*.tsx` for small chrome overrides,
3. keep app-only composition in the route shell.

---

## Final Design

## 1. Keep the three-layer model explicit

### App shell

Owned by the end-user app.

Examples:

- `examples/tanstack-barbershop/src/routes/admin.tsx`
- `examples/tanstack-barbershop/src/routes/admin/login.tsx`
- `examples/tanstack-barbershop/src/admin.css`

This layer owns:

1. `<head>`
2. favicon
3. route-level CSS
4. theme provider
5. `.dark` / system theme strategy
6. route-level auth page replacement when the app wants full control

### Server structure

Owned by `questpie/server/config/admin.ts`.

Example:

- `examples/tanstack-barbershop/src/questpie/server/config/admin.ts`

This layer owns:

1. `sidebar`
2. `dashboard`
3. minimal `branding`
4. admin locale

### Client rendering overrides

Owned by `questpie/admin/*` and discovered by the `admin-client` target.

This layer owns:

1. pages
2. views
3. widgets
4. fields
5. blocks
6. components

---

## 2. Reuse `pages` for full-page overrides

Where a full page is already a first-class concept, use the existing `pages` category instead of inventing smaller override APIs.

Examples:

1. `questpie/admin/pages/login.tsx`
2. `questpie/admin/pages/setup.tsx`
3. `questpie/admin/pages/dashboard.tsx`

This matches the built-in defaults already shipped from:

- `packages/admin/src/server/modules/admin/client/pages/login.ts`
- `packages/admin/src/server/modules/admin/client/pages/setup.ts`
- `packages/admin/src/server/modules/admin/client/pages/dashboard.ts`

Decision:

1. Do **not** add `dashboardHeader` as a new top-level concept.
2. Do **not** add a new login-page subsystem.
3. Prefer full page replacement through `pages/` when the requirement is actually page-level.

---

## 3. Reuse `components` for small chrome overrides

Where the requirement is not a full page, but a reusable chrome fragment, use reserved client-only keys in the existing `components` registry.

Proposed reserved component keys:

1. `sidebarBrand`
2. `sidebarNavItem`
3. `authLayout`

Expected file names in end-user apps:

1. `questpie/admin/components/sidebar-brand.tsx`
2. `questpie/admin/components/sidebar-nav-item.tsx`
3. `questpie/admin/components/auth-layout.tsx`

Because `admin-client` categories without factory functions derive keys from filenames, these files resolve to camelCase keys:

1. `sidebarBrand`
2. `sidebarNavItem`
3. `authLayout`

This behavior is already documented in:

- `apps/docs/content/docs/extend/codegen-internals.mdx`

Decision:

1. Do **not** add a new `chrome` category.
2. Do **not** add server-side `ComponentReference` support for these overrides.
3. Treat these as **client-only reserved keys** in the existing `components` registry.

---

## 4. Keep existing runtime props as app-composition escape hatches

The existing runtime props remain useful for app shell composition and should stay:

1. `AdminLayout` `header`
2. `AdminLayout` `footer`
3. `AdminSidebar` `afterBrand`
4. `AdminSidebar` `beforeFooter`
5. `AdminSidebar` `renderBrand`
6. `AdminSidebar` `renderNavItem`

Relevant files:

- `packages/admin/src/client/views/layout/admin-layout.tsx`
- `packages/admin/src/client/views/layout/admin-sidebar.tsx`

Decision:

1. These props stay as runtime escape hatches.
2. They are **not** the primary file-first white-label mechanism.
3. Docs should describe them as app-composition escape hatches, not the default path.

---

## 5. Keep theme selection explicit via CSS exports

The admin theme system is already CSS-first:

- `packages/admin/src/client/styles/index.css`
- `packages/admin/THEMING.md`

This RFC now keeps the CSS surface minimal while the theme direction settles:

1. `base.css`

Target import style:

```css
@import "@questpie/admin/client/styles/base.css";
```

`index.css` stays as the default alias for `base.css`.

Compatibility:

1. Keep the current `index.css` path working.
2. Make `index.css` equivalent to `base.css`.

---

## Code Changes

## A. No new codegen category

The following files should **not** gain a new `chrome` category:

- `packages/admin/src/server/plugin.ts`
- `packages/admin/src/server/codegen/admin-client-template.ts`
- `packages/admin/src/server/codegen/projection-validator.ts`

Reason:

1. Existing `components` and `pages` discovery already fit the problem.
2. Extra client-only keys already work with the current validator.

## B. Sidebar brand override through reserved component keys

Update:

- `packages/admin/src/client/views/layout/admin-sidebar.tsx`

Behavior:

1. Look up `admin.getComponents().sidebarBrand`.
2. If present, use it as the default brand renderer.
3. Keep `renderBrand` prop as the highest-priority runtime override.
4. Keep the existing built-in text fallback when no override exists.

Also add stable exported props for that component, for example:

```ts
type SidebarBrandProps = {
	name: string;
	collapsed: boolean;
};
```

## C. Sidebar nav item override through reserved component keys

Update:

- `packages/admin/src/client/views/layout/admin-sidebar.tsx`

Behavior:

1. Look up `admin.getComponents().sidebarNavItem`.
2. If present, use it as the default nav item renderer.
3. Keep `renderNavItem` prop as the highest-priority runtime override.
4. Keep the built-in nav item renderer as fallback.

Also add stable exported props, for example:

```ts
type SidebarNavItemProps = {
	item: NavigationItem;
	isActive: boolean;
	collapsed: boolean;
};
```

## D. Shared auth layout override through reserved component keys

Update:

- `packages/admin/src/client/views/auth/auth-layout.tsx`

Behavior:

1. Export `AuthLayoutProps` from the file.
2. Before rendering the built-in card layout, look up `admin.getComponents().authLayout`.
3. If present, delegate rendering to that override component.
4. Keep the existing built-in layout as fallback.

This automatically affects all pages that already use `AuthLayout`, including:

- `packages/admin/src/client/views/pages/login-page.tsx`
- `packages/admin/src/client/views/pages/setup-page.tsx`
- `packages/admin/src/client/views/pages/forgot-password-page.tsx`
- `packages/admin/src/client/views/pages/reset-password-page.tsx`
- `packages/admin/src/client/views/pages/accept-invite-page.tsx`
- `packages/admin/src/client/views/pages/invite-page.tsx`

## E. Export stable override prop types from the client entrypoint

Update:

- `packages/admin/src/exports/client.ts`

Export:

1. `AuthLayoutProps`
2. `SidebarBrandProps`
3. `SidebarNavItemProps`

This gives app code and skills a stable public typing surface for file-first overrides.

## F. Theme export cleanup

Update:

- `packages/admin/src/client/styles/index.css`
- `packages/admin/package.json`

Add explicit export paths for:

1. `./styles/base.css`
2. `./styles/index.css`

Keep:

1. current `./client/styles/index.css` path for backward compatibility

Optional example cleanup:

- `examples/tanstack-barbershop/src/admin.css`

to use the new canonical path.

## G. No server branding/theme expansion

The following files should remain minimal and should **not** gain favicon/theme responsibilities:

- `packages/admin/src/server/augmentation/index.ts`
- `packages/admin/src/server/augmentation/dashboard.ts`
- `packages/admin/src/server/modules/admin/dto/admin-config.dto.ts`
- `packages/admin/src/server/modules/admin/routes/admin-config.ts`

Reason:

1. These are server structure concerns.
2. Favicon and CSS theme selection belong to the app shell.

---

## Docs Changes

## A. Fix the core architecture story in docs

Update:

- `apps/docs/content/docs/reference/admin-api.mdx`

Add explicit sections for:

1. app shell ownership,
2. `config/admin.ts` responsibilities,
3. `questpie/admin/*` client responsibilities,
4. reserved component override keys in `questpie/admin/components/*`.

## B. Fix branding docs to stop treating favicon/theme as server config

Update:

- `apps/docs/content/docs/workspace/branding.mdx`

Change the messaging from:

1. "branding controls full visual identity"

to:

1. `branding.name` is server metadata,
2. favicon belongs to the app shell,
3. CSS theme belongs to the app shell,
4. sidebar/auth chrome overrides belong to `questpie/admin/components/*`.

## C. Expand sidebar docs with file-first chrome overrides

Update:

- `apps/docs/content/docs/workspace/views/sidebar.mdx`

Add:

1. `questpie/admin/components/sidebar-brand.tsx`
2. `questpie/admin/components/sidebar-nav-item.tsx`
3. explanation of when to use server `sidebar` config vs client override components

## D. Update codegen internals docs

Update:

- `apps/docs/content/docs/extend/codegen-internals.mdx`

Add:

1. client-only reserved component keys as an example of reusing the existing `components` category,
2. an explicit note that extra client-side category keys are valid when they do not need a server projection.

## E. Update package-level admin docs

Update:

- `packages/admin/README.md`
- `packages/admin/THEMING.md`

README additions:

1. shell vs config vs client files
2. page override examples
3. component override examples
4. canonical CSS import paths

THEMING additions:

1. `base.css` / `index.css` structure
2. app-owned `src/admin.css` pattern
3. canonical import paths

---

## Skill Changes

These changes are expected outside the repo codebase, in the QUESTPIE admin skill content.

Primary skill files to update:

- `/Users/drepkovsky/.agents/skills/questpie-admin/AGENTS.md`
- `/Users/drepkovsky/.agents/skills/questpie-admin/references/custom-ui.md`

## A. Update the default guidance

The skill should guide users in this order:

1. change the app shell first,
2. use `config/admin.ts` for structure,
3. use `questpie/admin/pages/*` for full-page overrides,
4. use `questpie/admin/components/*` for small chrome overrides,
5. use custom CSS on top of `base.css` for theme changes.

## B. Add concrete recipes

Add recipes for:

1. `questpie/admin/components/sidebar-brand.tsx`
2. `questpie/admin/components/sidebar-nav-item.tsx`
3. `questpie/admin/components/auth-layout.tsx`
4. `questpie/admin/pages/login.tsx`
5. `src/admin.css` importing `base.css` and overriding variables

## C. Add explicit anti-pattern guidance

The skill should explicitly avoid steering users toward:

1. adding favicon to `config/admin.ts`,
2. inventing a large server-side theme config,
3. adding a new admin codegen category when existing `pages` or `components` already solve the need.

---

## Example File-First Overrides

### Sidebar brand override

```text
questpie/admin/components/sidebar-brand.tsx
```

### Sidebar nav item override

```text
questpie/admin/components/sidebar-nav-item.tsx
```

### Shared auth layout override

```text
questpie/admin/components/auth-layout.tsx
```

### Full login page override

```text
questpie/admin/pages/login.tsx
```

### Theme selection in app shell

```text
src/admin.css
routes/admin.tsx
```

---

## Rejected Alternatives

## 1. New `chrome` admin-client category

Rejected because:

1. existing `components` already fits the need,
2. existing `pages` already fits page-level overrides,
3. new category means more plugin/codegen/docs surface for little gain.

## 2. Large server-side `branding` object

Rejected because:

1. it would mix shell concerns into server config,
2. it would duplicate app-owned route/CSS responsibilities,
3. it does not fit the example app architecture already present in the repo.

## 3. JS theme engine inside admin runtime

Rejected because:

1. theming is already CSS-first,
2. app shells already own theme strategy,
3. a single base CSS export is enough for now.

---

## Acceptance Criteria

1. A project can override the sidebar brand with `questpie/admin/components/sidebar-brand.tsx` without adding a new codegen category.
2. A project can override the default auth wrapper with `questpie/admin/components/auth-layout.tsx` without rewriting every auth page.
3. A project can still fully replace login or dashboard through `questpie/admin/pages/*.tsx`.
4. The docs explicitly describe shell vs server config vs client file responsibilities.
5. The skill steers users toward file-first overrides before proposing framework changes.
6. The CSS export story clearly supports `base.css`, `index.css`, and fully custom app themes.

---

## Short Version

The minimal path is:

1. keep shell concerns in the app,
2. keep structure in `config/admin.ts`,
3. reuse existing `pages` and `components` discovery,
4. add a few reserved client-only component keys,
5. formalize the base CSS export and docs,
6. avoid inventing a new subsystem.
