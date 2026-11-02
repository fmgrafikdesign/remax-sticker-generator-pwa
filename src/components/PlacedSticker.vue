<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import Moveable from 'moveable'
import { useComposition } from '@/composables/useComposition'

const props = defineProps<{
  id: number
  url: string
  selected: boolean
}>()

const { compositionEl, selectSticker } = useComposition()
const element = useTemplateRef<HTMLElement>('element')

// Only the selected sticker carries drag/scale/rotate handles.
let moveable: Moveable | null = null

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
  <div ref="element" class="placed-sticker" @click="selectSticker(id)">
    <img :src="url" class="img-fluid" alt="Sticker" @load="updateRect">
  </div>
</template>

<style scoped>
.placed-sticker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
}

.placed-sticker img {
  display: block;
}
</style>
