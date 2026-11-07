<script setup lang="ts">
import CanvasBottomBar from '@/components/CanvasBottomBar.vue'
import PlacedSticker from '@/components/PlacedSticker.vue'
import { useComposition } from '@/composables/useComposition'

const { imageUrl, stickers, selectedId, compositionEl, hasImage, setImage } = useComposition()

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) setImage(file)
}
</script>

<template>
  <section class="stage" aria-label="Bildbearbeitung">
    <div class="stage-canvas">
      <div
        v-if="hasImage"
        :ref="element => { compositionEl = element as HTMLElement | null }"
        class="composition"
      >
        <PlacedSticker
          v-for="sticker in stickers"
          :id="sticker.id"
          :key="sticker.id"
          :url="sticker.url"
          :selected="sticker.id === selectedId"
        />
        <img class="preview-image" :src="imageUrl" alt="Dein hochgeladenes Bild">
      </div>

      <label v-else class="dropzone">
        <input class="sr-only" name="image" type="file" accept="image/*" @change="onFileChange">
        <span class="eyebrow">01 — Foto</span>
        <span class="dropzone-title">Starte mit deinem Foto.</span>
        <span class="dropzone-hint">Wähle ein Bild von deinem Gerät. Es wird nicht hochgeladen, sondern bleibt bei dir.</span>
        <span class="btn btn--primary dropzone-button">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="1.75" />
            <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
          </svg>
          Bild wählen
        </span>
      </label>
    </div>
    <CanvasBottomBar />
  </section>
</template>

<style scoped>
.stage {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: var(--surface);
}

/* The photo never exceeds the space between header and toolbar; width and height limits keep its aspect ratio. */
.stage-canvas {
  position: relative;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-height: 0;
  min-width: 0;
  padding: 1.25rem 1rem;
  container-type: size;
  background: var(--hatch), var(--surface-2);
}

.preview-image {
  max-width: 100cqw;
  max-height: 100cqh;
  width: auto;
  height: auto;
}

/* shrink-wraps the rendered photo, so stickers and the saved picture never include empty margins */
.composition {
  position: relative;
  overflow: hidden;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 0 0 1px var(--line-strong), var(--shadow-float);
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 38rem;
  padding: 1.5rem;
  cursor: pointer;
  background-color: var(--surface);
  border: 1px dashed var(--line-strong);
  transition: border-color 0.15s;
}

.dropzone:hover,
.dropzone:has(input:focus-visible) {
  border-color: var(--ink);
}

.dropzone:has(input:focus-visible) {
  box-shadow: var(--focus-ring);
}

.dropzone:hover .dropzone-button {
  background-color: var(--primary-bg-hover);
}

.dropzone-title {
  font-size: clamp(2.25rem, 1.25rem + 4vw, 3.5rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.dropzone-hint {
  max-width: 26rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.dropzone-button {
  margin-top: 0.5rem;
  padding: 0 1.5rem;
}

@media (min-width: 60rem) {
  .stage-canvas {
    padding: 2rem;
  }

  .dropzone {
    padding: 2.5rem;
  }
}
</style>
