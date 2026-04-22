# QUESTPIE Admin — Theme System

## How Theming Works

The admin UI is **theme-agnostic**. All visual styling is controlled by CSS files in `packages/admin/src/client/styles/`. Components use standard Tailwind utilities (`bg-card`, `border-border`, `rounded-md`, `shadow-sm`) which resolve to values defined in the theme CSS. To create a completely different visual identity, you only change the CSS — zero component changes needed.

## Theme Presets

Import one preset instead of `index.css`:

| Import | Style |
| ------ | ----- |
| `@questpie/admin/client/styles/index.css` | Brutal (default, backward compat) |
| `@questpie/admin/client/styles/brutal.css` | Brutal — sharp corners, no shadows |
| `@questpie/admin/client/styles/soft.css` | Soft — rounded corners (8px), standard shadows |
| `@questpie/admin/client/styles/base.css` | Base only — no shadow scale, full control |

```css
/* Option A: default (brutal) */
@import "@questpie/admin/client/styles/index.css";

/* Option B: explicit brutal */
@import "@questpie/admin/client/styles/brutal.css";

/* Option C: soft rounded */
@import "@questpie/admin/client/styles/soft.css";

/* Option D: base only, define your own shadow scale */
@import "@questpie/admin/client/styles/base.css";
@theme inline {
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

All presets share the same color palette, typography, and animations — only `--radius` and `--shadow-*` differ.

## CSS Variables

### Surface Colors

| Variable       | Description                            |
| -------------- | -------------------------------------- |
| `--background` | Page background                        |
| `--foreground` | Primary text color                     |
| `--card`       | Elevated surfaces (cards, panels)      |
| `--popover`    | Floating surfaces (dropdowns, dialogs) |
| `--input`      | Form input backgrounds                 |
| `--muted`      | Subtle backgrounds (hover, headers)    |
| `--accent`     | Interactive hover backgrounds          |

### Brand & Semantic Colors

| Variable        | Description                     |
| --------------- | ------------------------------- |
| `--primary`     | Brand accent, CTAs, focus rings |
| `--secondary`   | Secondary action backgrounds    |
| `--destructive` | Errors, danger states           |
| `--success`     | Confirmations                   |
| `--warning`     | Caution states                  |
| `--info`        | Informational emphasis          |

### Structure

| Variable   | Description                                   |
| ---------- | --------------------------------------------- |
| `--border` | Default border color                          |
| `--ring`   | Focus ring color                              |
| `--radius` | Base border-radius (0 = sharp, 8px = rounded) |

### Typography

| Variable      | Description                                   |
| ------------- | --------------------------------------------- |
| `--font-sans` | Body text, descriptions, content              |
| `--font-mono` | UI chrome: buttons, badges, tabs, labels, nav |

## Font Convention

- **`font-mono`**: buttons, badges, card titles, dialog/sheet titles, tab triggers, field labels, breadcrumbs, nav items, sidebar group labels
- **`font-sans`**: input values, descriptions, table cell data, paragraph content, tooltips

## Layout Modes

| Mode        | Content Width        | Padding             | Use Case         |
| ----------- | -------------------- | ------------------- | ---------------- |
| `default`   | `max-w-4xl` centered | `p-3 md:p-4 lg:p-6` | Forms, settings  |
| `wide`      | Full width           | `p-3 md:p-4 lg:p-6` | Tables, cards    |
| `full`      | Full width           | `p-2 md:p-3`        | Kanban, calendar |
| `immersive` | Full width           | None                | Block editor     |

## Creating a Custom Theme

1. Start from a preset: import `brutal.css`, `soft.css`, or `base.css`
2. Override CSS variable values after the import
3. That's it — zero component changes needed

### Example: branded soft theme

```css
@import "@questpie/admin/client/styles/soft.css";

:root {
  --primary: oklch(0.55 0.22 260);   /* blue brand */
  --ring:    oklch(0.55 0.22 260);
  --radius:  6px;                     /* slightly less round than soft default */
}

body::before {
  display: none; /* no grid texture */
}
```

Same components, different CSS, completely different look.

## Dark / Light Mode

The CSS uses the standard convention:

- `:root` = light theme (default)
- `.dark` class on `<html>` = dark theme

This is compatible with `next-themes`, custom `ThemeProvider`, or any library that toggles a `.dark` class. Tailwind's `dark:` variant works automatically.

## Grid Texture

The background grid is a `body::before` pseudo-element using `--primary` color at 3% opacity with 40px spacing. To disable it, add `body::before { display: none; }` to your theme.

## Shadow & Radius Scale

The default brutalist theme sets all shadows to `none` and all radii to `0px` via `@theme inline`. Components still use `shadow-sm`, `rounded-md` etc. — they just resolve to the theme values.
