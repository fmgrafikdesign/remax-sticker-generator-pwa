# remax-sticker-generator-pwa

A small Vue-based PWA to get my feet wet with the vue.js framework and also make an useful application for RE/MAX SLS.
Pick a photo, stick RE/MAX stickers on it (drag, scale, rotate), and save the result as a JPEG.

Built with Vue 3 (`<script setup>`), TypeScript, Vite and `vite-plugin-pwa`. Requires Node 20.19+ or 22.12+.

## Scripts

| Command              | What it does                                              |
| -------------------- | --------------------------------------------------------- |
| `npm install`        | Install dependencies                                      |
| `npm run dev`        | Start the Vite dev server with hot reload                 |
| `npm run build`      | Type-check with `vue-tsc`, then build to `dist/`          |
| `npm run preview`    | Serve the production build (service worker is active here) |
| `npm run type-check` | Type-check only                                           |
| `npm run lint`       | ESLint (flat config, `eslint-plugin-vue` + typescript-eslint) |
| `npm test`           | Vitest unit tests                                         |

## Layout

- `src/composables/useComposition.ts` – photo, stickers and selection state, provided once in `App.vue`
- `src/composables/useToast.ts` + `ToastHost.vue` – notifications
- `src/components/PlacedSticker.vue` – one sticker on the photo; the selected one gets [Moveable](https://github.com/daybrush/moveable) handles
- `src/assets/sticker/` – every `png/jpg/svg` dropped in here shows up in the sticker list automatically
- `public/icons/` – app icons; the manifest and service worker are configured in `vite.config.ts`
