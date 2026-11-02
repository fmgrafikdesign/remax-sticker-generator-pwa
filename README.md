# remax-sticker-generator-pwa

A small Vue-based PWA to get my feet wet with the vue.js framework and also make an useful application for RE/MAX SLS.
Pick a photo, stick RE/MAX stickers on it (drag, scale, rotate), and save the result as a JPEG.

Built with Nuxt 4 (client-rendered, `<script setup>` components), TypeScript and `@vite-pwa/nuxt`.
Stickers live in an S3-compatible bucket; there is no database. Requires Node 22.22+ or 24.15+.

## Architecture

- **Stickers** are stored as `stickers/<ULID>.webp` plus a thumbnail `thumbs/<ULID>.webp`. ULIDs sort by time, so the
  list is newest first. The Nuxt server lists the bucket (`GET /api/stickers`) and serves images on the app's own origin
  (`GET /stickers/<id>.webp`, `…/<id>.thumb.webp`), so saving a picture never taints the canvas.
- **Admin** (`/admin`, linked as "Verwalten" at the bottom of the generator): enter a token once; it is stored in
  `localStorage` and re-checked on app start, when the browser comes back online, when the app becomes visible again and
  via "Prüfen". With a valid token you can upload (PNG/WebP) and delete stickers. Uploads are converted on the server with
  `sharp`: WebP, transparency kept, longest side at most 2048 px, at most 2 MB after conversion, raw upload up to 20 MB.
- **Tokens** come from `ADMIN_TOKENS` (comma-separated, e.g. `ADMIN_TOKENS=a1b2c3d4,e5f6g7h8`). Empty disables admin access.
- **Offline**: the app shell is precached; the sticker list is NetworkFirst (3 s timeout) and sticker images CacheFirst,
  so stickers seen before work offline. Uploading and deleting need a connection.

## Seeding

`seed/stickers/*.png` are the default stickers. Each file gets a deterministic id (fixed timestamp + hash of the file name),
so seeding never creates duplicates.

| Command | Behaviour |
| --- | --- |
| `npm run seed:dev` | Bucket ends up holding exactly the defaults: uploads are deleted, missing or changed defaults rewritten. Creates the bucket if missing. |
| `npm run seed:prod` | Seeds once. Does nothing if the marker `meta/seeded` exists, so deleted defaults stay deleted. |

## Local development

```sh
cp .env.example .env              # S3_* point at the compose MinIO, ADMIN_TOKENS=dev12345
docker compose up -d minio        # S3 on localhost:9100, console on localhost:9101
npm install
npm run seed:dev
npm run dev
```

Or run everything in containers: `docker compose up --build` (MinIO, a one-off `seed --mode=dev`, and the built app on
http://localhost:3000).

### Local S3

MinIO stopped publishing Docker images in October 2025 and the `minio/minio` repository is no longer pullable. The
compose file uses `${MINIO_IMAGE:-minio/minio:latest}`, which only works where that image is already cached locally.
Set `MINIO_IMAGE` to another MinIO build (e.g. Chainguard's) if needed.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Nuxt dev server. `--host localhost` works around a crash in `@nuxt/cli` 4.0.1 when no host is given; use `npm run dev -- --host 0.0.0.0` to test on a phone. |
| `npm run build` / `npm run preview` | Production build / run it (`.env` loaded if present) |
| `npm run type-check` | `nuxt typecheck` |
| `npm run lint` | ESLint |
| `npm test` | Unit tests |
| `npm run test:integration` | Seeding tests against the bucket from `.env` (needs MinIO running) |

## Deploying on Railway

Deploy with the `Dockerfile`. Set `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
(referencing the bucket's variables) and `ADMIN_TOKENS`; leave `S3_FORCE_PATH_STYLE` unset unless the endpoint needs
path-style URLs. Use `node scripts/seed.ts --mode=prod` as pre-deploy command.
