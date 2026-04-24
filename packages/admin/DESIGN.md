# QUESTPIE Admin Design Spec

This is the source of truth for the default `@questpie/admin` interface. App-level overrides may change the final look, but package primitives must follow this spec.

## Principles

- Design changes happen in primitives and tokens first, not in individual fields.
- Field components compose reusable primitives: `Input`, `Textarea`, `InputGroup`, `SelectSingle`, `SelectMulti`, `DateInput`, and rich text shell primitives.
- The sidebar keeps the QUESTPIE admin look; do not adapt it directly to external screenshots unless explicitly requested.
- Purple `#b700ff` is reserved for solid primary CTAs and brand marks. Navigation, focus, selected rows, badges, tabs, and form focus are neutral.
- Light mode should feel flat. Do not add drop shadows to normal inputs, table rows, toolbar containers, cards, or field shells.
- Floating layers may use a subtle tokenized shadow only when they detach from the page: dropdowns, popovers, dialogs, tooltips.

## Tokens

- `--control-height`: default single-line control height, `40px`.
- `--control-radius`: default field/select/button radius, `12px`.
- `--control-radius-inner`: nested icon/action radius inside a control, `8px`.
- `--control-background`: normal control background.
- `--control-border`: normal control border.
- `--control-shadow`: normal control shadow. Default: `none`.
- `--surface-radius`: cards, panels, toolbars, and grouped surfaces.
- `--surface-shadow`: persistent surface shadow. Default: `none`.
- `--floating-radius`: dropdowns, popovers, dialogs, tooltips.
- `--floating-shadow`: subtle shadow for detached layers only.

## Controls

- Inputs, textareas, selects, date/time inputs, relation selects, and searchable selects use the same radius and focus treatment.
- Default control height is `40px`; compact variants may be `32px` only when explicitly documented by a primitive.
- Focus uses neutral border/ring tokens, never primary purple.
- Select, datepicker, and popover-backed controls keep the same focus treatment while open: `--border-strong` plus the neutral ring.
- Normal controls do not cast shadows in light mode.
- Inline action buttons inside controls use `--control-radius-inner` and neutral hover surfaces.

## Selects

- `SelectSingle` is the visual primitive for single-value selects and relationship selects.
- `SelectField` and `RelationSelect` must share the same trigger primitive.
- Relationship selects may wrap the trigger in an action group for edit/create buttons, but the group must use the same control tokens.
- Clear and caret icons stay inside the trigger/action area and use muted neutral color.

## Textareas And Rich Text

- `Textarea` uses the same control token family as inputs/selects.
- Rich text editors are field surfaces, not cards. Their shell uses control border/radius and no persistent shadow.
- Rich text toolbars use a flat surface and subtle separators instead of raised card shadows.

## Datepickers

- Date, datetime, time, and range triggers use control tokens.
- Calendar popovers are floating layers and may use `--floating-shadow`.
- Selected day states are neutral foreground/background, not primary purple.

## Tables

- Table rows remain dense by default.
- Relationship and block cells must not force row height growth; chips should truncate horizontally before wrapping.
- Table containers do not use persistent light-mode shadows.

## Alerts And Confirmations

- Alert and confirmation icons are neutral by default. Do not color icons with `--destructive` when that token is a neutral surface color.
- Destructive confirmations communicate severity through copy and confirm action placement; icon containers use neutral border/surface tokens.
- Error text may use destructive semantics in forms/toasts, but dialog alert icons must remain readable in both light and dark mode.

## Theme Switching

- Admin supports `light`, `dark`, and `system` without requiring an app-level theme provider.
- If an app provides `theme` and `setTheme`, admin uses them.
- Theme switching belongs in the sidebar user dropdown, not the topbar.
