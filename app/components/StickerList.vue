<script setup lang="ts">
import { onMounted } from 'vue'
import { useComposition } from '@/composables/useComposition'
import { useStickerCatalog } from '@/composables/useStickerCatalog'
import { useToast } from '@/composables/useToast'

const { hasImage, addSticker } = useComposition()
const catalog = useStickerCatalog()
const toast = useToast()

onMounted(() => void catalog.load())

function onStickerClick(url: string) {
  if (addSticker(url)) {
    toast.success('Sticker hinzugefügt!', 1500)
  } else {
    toast.warning('Wähle zuerst ein Bild aus, bevor du Sticker hinzufügst.')
  }
}
</script>

<template>
  <section class="sticker-panel" aria-labelledby="sticker-panel-title">
    <header class="panel-head">
      <p class="eyebrow panel-eyebrow">
        <span>02 — Bibliothek</span>
        <span v-if="catalog.stickers.value.length" class="panel-count">{{ catalog.stickers.value.length }}</span>
      </p>
      <h2 id="sticker-panel-title" class="panel-title">Sticker</h2>
      <p class="panel-hint" :class="{ 'is-waiting': !hasImage }">
        <template v-if="hasImage">Tippen zum Hinzufügen</template>
        <template v-else>Wähle erst ein Bild aus, um Sticker hinzufügen zu können.</template>
      </p>
    </header>

    <div class="panel-body">
      <p v-if="catalog.state.value === 'error' && catalog.stickers.value.length === 0" class="panel-message">
        Sticker konnten nicht geladen werden.
      </p>
      <ul v-else id="sticker-list" class="sticker-grid" :class="{ 'is-inactive': !hasImage }">
        <template v-if="catalog.state.value !== 'ready' && catalog.stickers.value.length === 0">
          <li v-for="n in 9" :key="n" class="sticker-skeleton" aria-hidden="true" />
        </template>
        <li v-for="sticker in catalog.stickers.value" :key="sticker.id">
          <button class="sticker-tile" type="button" aria-label="Sticker hinzufügen" @click="onStickerClick(sticker.url)">
            <img :src="sticker.thumbnailUrl" alt="" loading="lazy" draggable="false">
          </button>
        </li>
      </ul>
    </div>

    <footer class="panel-foot">
      <NuxtLink to="/admin" class="manage-link">
        Verwalten
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </NuxtLink>
    </footer>
  </section>
</template>

<style scoped>
/* Desktop: a column with its own scroll area and a pinned footer, divided from the editor by a hairline. */
.sticker-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: var(--surface);
  border-left: 1px solid var(--line-strong);
}

.panel-head {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid var(--line-strong);
}

.panel-eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-count {
  padding: 0 0.5rem;
  color: var(--ink-soft);
  background-color: var(--surface-3);
  border: 1px solid var(--line);
}

.panel-title {
  margin-top: 0.5rem;
  font-size: 2.25rem;
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.045em;
}

.panel-hint {
  margin-top: 0.5rem;
  line-height: 1.4;
  color: var(--muted);
}

.panel-hint.is-waiting {
  color: var(--accent);
}

.panel-body {
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.panel-message {
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--muted);
}

/* Edge-to-edge ruled grid: every cell draws its right and bottom rule, the grid's -1px margin hides the outermost ones. */
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.25rem, 1fr));
  margin: 0 -1px -1px 0;
}

.sticker-grid > li {
  border-right: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
}

.sticker-tile,
.sticker-skeleton {
  display: block;
  width: 100%;
  aspect-ratio: 1;
}

.sticker-tile {
  padding: 0.75rem;
  background: var(--checker);
  border: 0;
  border-radius: 0;
  transition: box-shadow 0.15s, opacity 0.15s, transform 0.1s;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

.sticker-tile:focus-visible {
  box-shadow: inset 0 0 0 2px var(--accent);
}

.sticker-tile img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

@media (hover: hover) {
  .sticker-tile:hover {
    box-shadow: inset 0 0 0 2px var(--ink);
  }
}

.sticker-tile:active {
  transform: scale(0.96);
}

/* Still clickable so the tap can explain why nothing happens, but clearly not ready. */
.is-inactive .sticker-tile {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (hover: hover) {
  .is-inactive .sticker-tile:hover {
    box-shadow: none;
  }
}

.sticker-skeleton {
  background: linear-gradient(100deg, var(--surface-3) 30%, var(--surface-2) 50%, var(--surface-3) 70%) 0 0 / 200% 100%;
  animation: shimmer 1.4s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.panel-foot {
  background-color: var(--surface);
  border-top: 1px solid var(--line-strong);
}

.manage-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--muted);
  text-decoration: none;
}

.manage-link .icon {
  width: 1rem;
  height: 1rem;
}

.manage-link:hover {
  color: var(--ink);
  background-color: var(--surface-3);
}

.manage-link:focus-visible {
  box-shadow: inset 0 0 0 2px var(--accent);
}

/* Phone: no scroll area. The list is plain content on the page, "Verwalten" is the last thing on it. */
@media (max-width: 59.99rem) {
  .sticker-panel {
    border-left: 0;
  }

  .panel-head {
    padding: 1.5rem var(--page-gutter) 0.75rem;
  }

  .panel-title {
    font-size: 2rem;
  }

  .panel-body {
    padding: 0;
    overflow: clip;
  }

  .panel-message {
    padding: 2rem var(--page-gutter);
  }

  .sticker-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .manage-link {
    padding: 1rem var(--page-gutter);
  }
}

@media (min-width: 40rem) and (max-width: 59.99rem) {
  .sticker-grid {
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  }
}
</style>
