<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
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
  <div class="image-canvas h100">
    <AppTitle />
    <div class="image-preview-wrapper" :class="{ h50: !hasImage, w100: !hasImage, 'has-image': hasImage }">
      <div
        v-if="hasImage"
        :ref="element => { compositionEl = element as HTMLElement | null }"
        class="composition drop-shadow"
      >
        <PlacedSticker
          v-for="sticker in stickers"
          :id="sticker.id"
          :key="sticker.id"
          :url="sticker.url"
          :selected="sticker.id === selectedId"
        />
        <img class="preview-image" :src="imageUrl" alt="Lade dein Bild hoch.">
      </div>

      <div v-else class="file-upload-form drop-shadow image-placeholder">
        <div class="image-upload-wrapper h100 w100">
          <input id="image-upload" class="d-none" name="image" type="file" accept="image/*" @change="onFileChange">

          <label for="image-upload" class="upload-image-label"><svg class="placeholder-vector" viewBox="0 0 32 32"><path d="M29.996 4c0.001 0.001 0.003 0.002 0.004 0.004v23.993c-0.001 0.001-0.002 0.003-0.004 0.004h-27.993c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993zM30 2h-28c-1.1 0-2 0.9-2 2v24c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-24c0-1.1-0.9-2-2-2v0z"/>
            <path d="M26 9c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/>
            <path d="M28 26h-24v-4l7-12 8 10h2l7-6z"/></svg> <br> Bild wählen</label>
        </div>
      </div>
    </div>
    <CanvasBottomBar />
  </div>
</template>

<style scoped>
.image-canvas {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  position: relative;
  background-color: #292b2f;
}

/* The photo never exceeds the space between title and bottom bar; width and height limits keep its aspect ratio. */
.preview-image {
  max-width: 100cqw;
  max-height: 100cqh;
  height: auto;
  display: block;
}

.image-preview-wrapper {
  position: relative;
  padding: 1rem;
  margin: auto;
  min-height: 0;
  min-width: 0;
  width: 100%
}

.image-preview-wrapper.has-image {
  flex: 1 1 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: size;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #6d7275;
  border: 2px dashed #999ba0;
  border-radius: 4px;
}

.image-upload-wrapper {
  display: table;
  padding-bottom: 10px
}

.upload-image-label {
  width: 100%;
  height: 100%;
  display: table-cell;
  vertical-align: middle;
  padding-bottom: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 90%;
  color: #dce0ea;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.drop-shadow {
  box-shadow:
    0 10.8px 23.6px rgba(0, 0, 0, 0.037),
    0 15.1px 30.6px rgba(0, 0, 0, 0.057),
    0 19.1px 36.1px rgba(0, 0, 0, 0.081),
    0 33px 60px rgba(0, 0, 0, 0.12);
}

/* shrink-wraps the rendered photo, so stickers and the saved picture never include empty margins */
.composition {
  position: relative;
  overflow: hidden;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto
}

.placeholder-vector {
  width: 25%;
  max-width: 64px;
  height: 92px;
  stroke: #b0b3bb;
  fill: #B0B3BB;
}
</style>
