<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import Moveable from 'moveable'
import { useComposition } from '@/composables/useComposition'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  id: number
  url: string
  selected: boolean
}>()

const { compositionEl, selectSticker, removeSticker } = useComposition()
const toast = useToast()
const element = useTemplateRef<HTMLElement>('element')

// Only the selected sticker carries drag/scale/rotate handles.
let moveable: Moveable | null = null

/** Smallest initial width, as share of the photo width, so small stickers stay easy to grab. */
const MIN_WIDTH_SHARE = 0.25
const placed = ref(false)

function enableMoveable() {
  if (moveable || !element.value) return
  // Handles live outside the composition so its overflow clipping never cuts them off
  const container = compositionEl.value?.parentElement ?? document.body
  moveable = new Moveable(container, {
    target: element.value,
    container,
    draggable: true,
    scalable: true,
    rotatable: true,
    keepRatio: true,
    throttleDrag: 0,
    throttleScale: 0,
    throttleRotate: 0
  })
    .on('drag', ({ target, transform }) => { target.style.transform = transform })
    .on('scale', ({ target, transform }) => { target.style.transform = transform })
    .on('rotate', ({ target, transform }) => { target.style.transform = transform })
  // The box stays hidden until measured once; measure now rather than on the next resize/image load.
  updateRect()
}

function disableMoveable() {
  moveable?.destroy()
  moveable = null
}

function updateRect() {
  moveable?.updateRect()
}

/**
 * First placement: bottom-centre of the photo, at the sticker's pixel size relative to the photo's
 * (so a full-width overlay spans the photo), but at least MIN_WIDTH_SHARE of the photo width and never larger than it.
 */
function onImageLoad(event: Event) {
  const sticker = event.target as HTMLImageElement
  const photo = compositionEl.value?.querySelector<HTMLImageElement>('img.preview-image')
  if (!placed.value && element.value && photo?.naturalWidth) {
    const photoWidth = photo.clientWidth
    const photoHeight = photo.clientHeight
    let width = sticker.naturalWidth * (photoWidth / photo.naturalWidth)
    width = Math.max(width, photoWidth * MIN_WIDTH_SHARE)
    const aspect = sticker.naturalHeight / sticker.naturalWidth
    width = Math.min(width, photoWidth, photoHeight / aspect)
    element.value.style.width = `${width}px`
    element.value.style.left = `${(photoWidth - width) / 2}px`
    element.value.style.top = `${photoHeight - width * aspect}px`
    placed.value = true
  }
  updateRect()
}

/** Offline with an uncached sticker: an invisible sticker would only block saving, so drop it. */
function onImageError() {
  removeSticker(props.id)
  toast.warning('Der Sticker konnte nicht geladen werden. Bist du offline?')
}

onMounted(() => {
  if (props.selected) enableMoveable()
  window.addEventListener('resize', updateRect)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateRect)
  disableMoveable()
})

watch(() => props.selected, selected => {
  if (selected) enableMoveable()
  else disableMoveable()
})
</script>

<template>
  <div ref="element" class="placed-sticker" :class="{ placed }" @click="selectSticker(id)">
    <img :src="url" class="img-fluid" alt="Sticker" @load="onImageLoad" @error="onImageError">
  </div>
</template>

<style scoped>
.placed-sticker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  /* hidden until sized and positioned from the loaded image */
  visibility: hidden;
}

.placed-sticker.placed {
  visibility: visible;
}

.placed-sticker img {
  display: block;
}
</style>
