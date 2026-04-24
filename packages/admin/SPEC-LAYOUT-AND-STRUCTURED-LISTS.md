# Admin Layout And Structured Lists Spec

## Goals

- Move the admin away from a global topbar into a shell + view-owned header model.
- Match the flat Autopilot task-list feel: neutral surfaces, no heavy card/table chrome, compact headers, subtle row hover, and clear hierarchy through spacing/typography.
- Keep `TableView` as the default collection list view, while evolving it toward grouping and ordering without losing current capabilities.
- Preserve first-column visibility, horizontal scrolling, selection, bulk actions, saved views, filters, locale switching, and custom actions.

## Non-Goals

- Do not introduce breadcrumbs into the new UI. CMS does not rely on them.
- Do not build tree/drag reorder in the first layout pass.
- Do not replace the view registry or create a new table view unless tree semantics require it later.
- Do not use primary purple for general hover, focus, grouping, or selected table states.

## Shell Layout

`AdminLayout` becomes a shell only:

- Sidebar navigation.
- Content inset with rounded top-left corner on desktop.
- Global search modal state.
- Toaster.
- Skip link and main focus target.

The shell must not render a global topbar. Each view owns its own header and actions.

## Sidebar Header

Expanded sidebar header:

- Brand/logo link on the left.
- Search icon action beside the brand area.
- Sidebar trigger beside search.

Collapsed sidebar header:

- Logo remains centered.
- A small always-visible edge tab is shown on the right edge of the collapsed sidebar.
- Hover/focus reveals a small floating pill with expand and search actions.
- The reveal must be absolutely positioned so there is no layout shift.

## View Header

Add a shared primitive for view-owned headers:

```tsx
<AdminViewLayout
	header={
		<AdminViewHeader
			title="Oliver R."
			titleAccessory={<LocaleSwitcher />}
			meta={
				<>
					<span>ID: 5a6799e9...</span>
					<span>·</span>
					<span>Vytvorené 27. 3. 2026, 01:23</span>
					<span>·</span>
					<span>Aktualizované 27. 3. 2026, 01:23</span>
				</>
			}
			actions={actions}
		/>
	}
>
	{content}
</AdminViewLayout>
```

Header rules:

- Flat: no border by default.
- Supports title, title accessory, description/meta, and actions.
- Title can be large in detail views and compact in list views.
- Meta uses muted mono text with tabular numbers.
- Actions are right-aligned on desktop and wrap below title on small screens.

## Table View UI

The default table should become a flat list-table hybrid:

- No large table card shell.
- Rows use neutral hover, rounded corners, and compact padding.
- Column headers remain visible but subtle: mono, uppercase, muted, small.
- First/title column remains sticky and visible.
- Horizontal scrolling remains for wide schemas.
- Selection and row action behavior stays intact.
- Bulk toolbar behavior stays intact.

Search behavior:

- Hide the always-visible collection search bar by default.
- Move collection search behind an icon action near view options/actions.
- Active search shows a small active state/dot/chip with clear affordance.

View options behavior:

- Render as an icon action with tooltip/accessibility label.
- Show active indicator when filters, grouping, hidden columns, or deleted-state options are active.

## Grouping

Grouping should initially enhance the existing `TableView`.

Static collection config shape:

```ts
list: {
	grouping: {
		fields: ["status", "category"],
		defaultField: "status",
		defaultCollapsed: false,
		showCounts: true,
	},
}
```

Saved view state:

```ts
{
	groupBy: "status",
	collapsedGroups: ["draft", "archived"],
}
```

Phase 1 grouping is client-side over the current fetched page. Counts are page-local. Server-side grouped counts can come later.

Group headers use the Autopilot task-list treatment:

- Sticky inside the scroll area.
- Muted uppercase mono label.
- Inline count.
- Tiny caret for collapse/expand.
- Flat background with at most a subtle bottom divider.

## Order Field And Drag Reorder

Ordering should feel first-class and Linear-like, not like a technical admin toggle. The initial implementation is a safe mode affordance and typed config; drag/write behavior comes only after scope and pagination semantics are explicit.

Suggested config:

```ts
list: {
	orderable: {
		direction: "asc",
		step: 10,
	},
}
```

The collection must define a numeric field named `order`. This is a convention, not magic: authors opt in with `orderable`, and the field name makes it clear that reorder writes update display order rather than business data like `price`.

UI rules:

- Reorder mode toggle near view actions with compact neutral styling, never primary purple.
- Show a quiet handle/ordered-state column only in reorder mode.
- Reorder only when sorted by the conventional `order` field.
- Disable during active search, grouping, filter state, or sort mismatch.
- Do not fake persistence. Until writes are wired, the mode is explicit and read-only.
- Be explicit about pagination/scope limitations before enabling production writes.

Production reorder should use a dedicated transactional API rather than many independent row updates:

```http
POST /admin/collections/:collection/reorder
```

```json
{
	"field": "order",
	"ids": ["a", "b", "c"],
	"scope": { "parent": null, "status": "published" }
}
```

The API must preserve access checks, field write access, validation, hooks, versioning, realtime invalidation, and conflict handling.

## Parent Field / Tree View

Tree mode is possible but semantically larger than table styling.

Suggested config:

```ts
list: {
	tree: {
		parentField: "parent",
		orderField: "order",
		defaultExpandedDepth: 1,
	},
}
```

Risks:

- Flat pagination can split parents and children across pages.
- Search/filter semantics need a decision: matches only vs matches plus ancestors.
- Moving nodes needs cycle prevention and scoped reorder semantics.

Recommendation:

- Keep simple grouping in default `TableView`.
- Implement hierarchy later as a structured mode or new `collectionTree` view that shares column/action/filter utilities.

## Phases

### Phase 1: Shell And Flat View Headers

- Remove global admin topbar from `AdminLayout`.
- Move global search/sidebar trigger into sidebar header.
- Add collapsed edge tab + hover/focus pill.
- Add `AdminViewLayout` and `AdminViewHeader`.
- Migrate collection list, collection form, and global form headers.

### Phase 2: Flat Table Treatment

- Hide collection search behind an icon action.
- Render view options as icon action.
- Flatten table rows and headers.
- Keep sticky first/title column and horizontal scroll.

### Phase 3: Grouping

- Extend list config and saved view config with grouping fields.
- Add grouping UI to View Options.
- Render client-side grouped rows with sticky group headers.

### Phase 4: Ordering

- Add order config.
- Add reorder mode and drag handles.
- Add transactional reorder API before production use.

### Phase 5: Tree/Hierarchy

- Add tree config.
- Build structured row model or separate `collectionTree` view.
- Define search/filter/pagination semantics.

### Future: Admin Motion And Polish Pass

- Run the whole admin through `make-interfaces-feel-better` for spacing, optical alignment, hit areas, typography, tabular numbers, focus states, and interaction polish.
- Run a dedicated `ui-animation` pass for natural motion: shared motion tokens, tooltip/popover/sheet transitions, row/reorder movement, contextual icon feedback, reduced-motion handling, and interruption-safe animations.
- Keep the pass separate from data/modeling work so animation does not hide state bugs or incomplete reorder/tree semantics.

## Backend Primitive Audit

Existing primitives we should reuse:

- Core CRUD supports `orderBy` on top-level collection queries and nested relation queries. It accepts object, array, and function syntax, so multi-field ordering already exists at the read layer.
- Core CRUD supports nested `where`, nested `with`, relation filters, relation `orderBy`, relation `limit`, and relation `offset`.
- Relation fields can model parent/child data with normal self-relations, but they do not add tree semantics by themselves.
- Transaction utilities already exist through `withTransaction`, `withTransactionOrExisting`, and `onAfterCommit`.
- CRUD update/delete paths already run access checks, field access, validation, hooks, versioning, realtime/search side effects, and bulk metadata.
- Admin already has `.list()` as the right server config extension point. New built-in table options should extend `ListViewConfig`; no new codegen category is needed.
- Admin saved views and preferences already store JSON, so user-specific group/search/view settings can be added by extending `ViewConfiguration` without a database shape change.

Implemented or in-progress primitives:

- Top-level `find({ groupBy })` exists for grouped list pagination/counts.
- Heterogeneous batch update exists: `updateBatch({ updates: [{ id, data }] })`. It is the foundation for reorder because it updates different values per row in one transaction while reusing normal update behavior.

Missing primitives:

- No dedicated reorder API exists.
- No backend tree API exists: no `findTree`, no move-node API, no cycle prevention, no sibling-scoped reorder primitive.
- No list config exists yet for `tree`, `search.placement`, or `viewOptions.placement`.

Required extension surfaces for any new `.list()` option:

- `packages/admin/src/server/augmentation/form-layout.ts`: extend server `ListViewConfig`.
- `packages/questpie/src/server/collection/introspection.ts`: extend `AdminListViewSchema` and pass fields through `extractAdminConfig()`.
- `packages/admin/src/client/builder/types/collection-types.ts`: extend client list config type.
- `packages/admin/src/shared/types/saved-views.types.ts`: extend `ViewConfiguration` only for user-adjustable state.
- `packages/admin/src/client/views/collection/table-view.tsx`: normalize config cascade and runtime behavior.

Backend work by phase:

- Phase 1 and 2 need no new backend primitives. Layout, search icon placement, view options icon placement, and flat rows can be implemented with existing APIs.
- Phase 3 grouping uses core `find({ groupBy })` for cross-page group counts and group pagination.
- Phase 4 reorder should build on `updateBatch` first. A dedicated reorder endpoint can still be added later for rank-gap conflict handling, scoped reindexing, and clearer API semantics.
- Phase 5 tree/hierarchy should introduce explicit tree semantics or a dedicated `collectionTree` view. Parent self-relations are enough to store the data, but not enough for safe tree UI behavior.

Backend implementation queue:

- Add `CRUD.updateBatch()` with type-safe `updates: [{ id, data }]` input.
- Expose `POST /:collection/update-batch` and client SDK `collections.*.updateBatch()`.
- Add tests for heterogeneous per-row updates and transactional rollback behavior.
- Use `updateBatch` as the initial reorder write primitive.
- Add a dedicated `reorder` helper/route only after we define rank strategy, scope semantics, and conflict handling.
