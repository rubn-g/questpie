# {{projectName}}

A [QUESTPIE](https://questpie.com) app built with TanStack Start.

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- [Docker](https://docker.com) (for local PostgreSQL)

### Setup

```bash
# 1) Start PostgreSQL
docker compose up -d

# 2) Run migrations
bun questpie migrate

# 3) Start development server
bun dev
```

- Admin panel: `http://localhost:3000/admin`
- API docs (Scalar): `http://localhost:3000/api/docs`

## Project Structure

```text
src/
  questpie/
    server/
      questpie.config.ts             # Runtime config
      modules.ts                     # Module list (admin/openapi/...)
      app.ts                         # Re-export of generated app
      .generated/                    # Codegen output (do not edit manually)
      collections/
        posts.collection.ts
      globals/
        site-settings.global.ts
    admin/
      admin.ts                       # Re-export of generated admin config
  routes/
    api/$.ts                         # QUESTPIE fetch handler mount
    admin.tsx
    admin/
  lib/
    env.ts
    client.ts
    auth-client.ts
    query-client.ts
migrations/
```

## Scripts

| Command                       | Description                                   |
| ----------------------------- | --------------------------------------------- |
| `bun dev`                     | Start development server                      |
| `bun build`                   | Build for production                          |
| `bun start`                   | Start production server                       |
| `bun check-types`             | Type check                                    |
| `bun questpie migrate`        | Run migrations                                |
| `bun questpie migrate:create` | Create migration                              |
| `bunx questpie generate`      | Regenerate `src/questpie/server/.generated/*` |

## Adding a Collection

1. Create a file in `src/questpie/server/collections/` (example: `products.collection.ts`).
2. Export a collection builder from that file.
3. Run `bunx questpie generate`.
4. Run `bun questpie migrate:create`.

Collections are discovered automatically by codegen. No manual `app.ts` registration is required.

## Adding a Global

1. Create a file in `src/questpie/server/globals/` (example: `marketing.global.ts`).
2. Export a global builder from that file.
3. Run `bunx questpie generate`.
4. Run `bun questpie migrate:create`.

Globals are discovered automatically by codegen. No manual `app.ts` registration is required.
