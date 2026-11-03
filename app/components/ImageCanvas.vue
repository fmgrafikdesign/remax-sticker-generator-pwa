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
        <span class="dropzone-icon" aria-hidden="true">
          <svg class="icon" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="1.75" />
            <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
          </svg>
        </span>
        <span class="dropzone-title">Starte mit deinem Foto</span>
        <span class="dropzone-hint">Wähle ein Bild von deinem Gerät. Es wird nicht hochgeladen, sondern bleibt bei dir.</span>
        <span class="btn btn--primary dropzone-button">Bild wählen</span>
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
  background-color: #e9eef5;
  background-image: radial-gradient(circle, rgb(15 27 45 / 13%) 1px, transparent 1.5px);
  background-size: 20px 20px;
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
  border-radius: 6px;
  box-shadow: var(--shadow-lg);
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  max-width: 34rem;
  max-height: 26rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  background-color: rgb(255 255 255 / 70%);
  border: 2px dashed #9db8d6;
  border-radius: var(--radius-lg);
  transition: background-color 0.15s, border-color 0.15s, transform 0.15s;
}

.dropzone:hover,
.dropzone:has(input:focus-visible) {
  background-color: #fff;
  border-color: var(--brand);
}

.dropzone:has(input:focus-visible) {
  box-shadow: var(--focus-ring);
}

.dropzone:hover .dropzone-button {
  background-color: var(--brand-hover);
}

.dropzone-icon {
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  margin-bottom: 0.5rem;
  color: var(--brand);
  background-color: var(--brand-tint);
  border-radius: 50%;
}

.dropzone-icon .icon {
  width: 2rem;
  height: 2rem;
  stroke-width: 1.75;
}

.dropzone-title {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.2;
}

.dropzone-hint {
  max-width: 24rem;
  color: var(--muted);
  line-height: 1.45;
}

.dropzone-button {
  margin-top: 0.75rem;
  padding: 0 1.5rem;
}

@media (min-width: 60rem) {
  .stage {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .stage-canvas {
    padding: 2rem;
  }
}
</style>
