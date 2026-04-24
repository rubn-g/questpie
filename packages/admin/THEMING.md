# QUESTPIE Admin — Theme System

## How Theming Works

The admin UI is **theme-agnostic**. All visual styling is controlled by CSS files in `packages/admin/src/client/styles/`. Components use standard Tailwind utilities (`bg-card`, `border-border`, `rounded-md`, `shadow-sm`) which resolve to values defined in the theme CSS. To create a completely different visual identity, you only change the CSS — zero component changes needed.

## Stylesheet Entry Points

Import the admin base stylesheet and override CSS variables in your app CSS:

| Import                                    | Style                                                |
| ----------------------------------------- | ---------------------------------------------------- |
| `@questpie/admin/client/styles/index.css` | Default alias for base                               |
| `@questpie/admin/client/styles/base.css`  | Base tokens, Tailwind mappings, and shared utilities |

```css
/* Default */
@import "@questpie/admin/client/styles/index.css";

/* Or explicit base */
@import "@questpie/admin/client/styles/base.css";

@theme inline {
	--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

`index.css` and `base.css` currently resolve to the same admin base style.

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

1. Import `base.css`
2. Override CSS variable values after the import
3. That's it — zero component changes needed

### Example: branded theme

```css
@import "@questpie/admin/client/styles/base.css";

:root {
	--primary: oklch(0.55 0.22 260); /* blue brand */
	--ring: oklch(0.55 0.22 260);
	--radius: 6px;
}
```

Same components, different CSS, completely different look.

## Dark / Light Mode

The CSS uses the standard convention:

- `:root` = light theme (default)
- `.dark` class on `<html>` = dark theme

This is compatible with `next-themes`, custom `ThemeProvider`, or any library that toggles a `.dark` class. Tailwind's `dark:` variant works automatically.

## Shadow & Radius Scale

The base stylesheet defines standard shadows and an 8px radius. Components use `shadow-sm`, `rounded-md`, etc. so custom themes can change the final visual system by overriding `--shadow-*` and `--radius` values.
