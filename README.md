# quangdk.com

[![ci](https://github.com/dakiquang/quangdk.com/actions/workflows/ci.yml/badge.svg)](https://github.com/dakiquang/quangdk.com/actions/workflows/ci.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fquangdk.com&label=quangdk.com&up_message=online&down_message=offline)](https://quangdk.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Source of [quangdk.com](https://quangdk.com), the personal site of Quang Dang. Server-rendered on the edge, with a CMS and no client framework on public pages.

## Measured

Lighthouse 12 against production, 31 October 2026:

| | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Mobile | 95 | 100 | 100 | 100 | 2.3 s | 0 | 0 ms |
| Desktop | 97 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7, server output, TypeScript |
| CMS | EmDash, admin at `/_emdash/admin` |
| Styling | Tailwind CSS v4 |
| Hosting | Cloudflare Workers |
| Data | D1 for content, R2 for media |

## How it's built

- Content lives in the database, so publishing doesn't need a deploy. `seed/seed.json` defines the schema and starting content.
- Motion is progressive enhancement. The page reads fully without JavaScript, and everything stops for reduced motion.
- One red dot travels between section titles as you scroll, built from small scripts in `src/scripts/`.

## Run it

Needs Node 22.23.4 or later and pnpm 10.

```bash
pnpm install
pnpm dev
pnpm seed:local
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server at http://localhost:4321 |
| `pnpm typecheck` | `astro check` |
| `pnpm build` | Production build |
| `pnpm deploy` | Build and `wrangler deploy` |

Secrets stay in `.env` locally and in `wrangler secret put` in production.
