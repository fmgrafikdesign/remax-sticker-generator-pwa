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
      <NuxtLink to="/admin" class="manage-link">Verwalten</NuxtLink>
    </footer>
  </section>
</template>

<style scoped>
/* Desktop: a card with its own scroll area and a pinned footer. */
.sticker-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.panel-head {
  padding: 1.25rem 1.25rem 0.75rem;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}

.panel-hint {
  margin-top: 0.25rem;
  color: var(--muted);
  line-height: 1.4;
}

.panel-hint.is-waiting {
  color: var(--brand);
}

.panel-body {
  flex: 1;
  min-height: 0;
  padding: 0.5rem 1.25rem 1.25rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.panel-message {
  padding: 2rem 0;
  text-align: center;
  color: var(--muted);
}

.sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.25rem, 1fr));
  gap: 0.625rem;
}

.sticker-tile,
.sticker-skeleton {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
}

.sticker-tile {
  padding: 0.5rem;
  background: var(--checker);
  border: 1px solid var(--line);
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s, opacity 0.15s;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

.sticker-tile img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

@media (hover: hover) {
  .sticker-tile:hover {
    border-color: var(--brand);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.sticker-tile:active {
  transform: scale(0.96);
}

/* Still clickable so the tap can explain why nothing happens, but clearly not ready. */
.is-inactive .sticker-tile {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (hover: hover) {
  .is-inactive .sticker-tile:hover {
    border-color: var(--line);
    box-shadow: none;
    transform: none;
  }
}

.sticker-skeleton {
  background: linear-gradient(100deg, #eceff4 30%, #f7f9fb 50%, #eceff4 70%) 0 0 / 200% 100%;
  animation: shimmer 1.4s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.panel-foot {
  padding: 0.75rem 1.25rem;
  text-align: center;
  background-color: #fafbfd;
  border-top: 1px solid var(--line);
}

.manage-link {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  border-radius: 6px;
}

.manage-link:hover {
  color: var(--brand);
  background-color: var(--brand-tint);
}

/* Phone: no card. The list is plain content on the white page, "Verwalten" is the last thing on it. */
@media (max-width: 59.99rem) {
  .sticker-panel {
    background-color: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
  }

  .panel-head {
    padding: 1.25rem var(--page-gutter) 0.75rem;
  }

  .panel-body {
    padding: 0 var(--page-gutter) 1rem;
    overflow: visible;
  }

  .sticker-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .panel-foot {
    padding: 1rem var(--page-gutter) 2rem;
    background-color: transparent;
    border-top: 0;
  }
}

@media (min-width: 40rem) and (max-width: 59.99rem) {
  .sticker-grid {
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  }
}
</style>
