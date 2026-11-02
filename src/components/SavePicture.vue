<script setup lang="ts">
import { computed } from 'vue'
import { saveAs } from 'file-saver'
import { stickerFilename, useComposition } from '@/composables/useComposition'
import { useToast } from '@/composables/useToast'
import { renderComposition } from '@/utils/renderComposition'

const { compositionEl, stickers, filename } = useComposition()
const toast = useToast()
const active = computed(() => stickers.value.length > 0)

async function savePicture() {
  const composition = compositionEl.value
  if (!composition) {
    toast.info('Wähle zuerst ein Bild aus.')
    return
  }

  if (stickers.value.length === 0) {
    toast.warning('Füge mindestens einen Sticker hinzu.')
    return
  }

  try {
    const blob = await renderComposition(composition)
    // TODO saving doesn't work on iOS Safari & Chrome
    saveAs(blob, stickerFilename(filename.value))
    toast.success('Bild erfolgreich gespeichert! Du kannst es über die Statusleiste deines Telefons aufrufen & teilen.', 5000)
  } catch (error) {
    console.error(error)
    toast.warning('Das Bild konnte nicht gespeichert werden.')
  }
}
</script>

<template>
  <div class="save-sticker-wrapper ml-auto button-wrapper" @click="savePicture">
    <div class="save-button button" :class="{ active }">
      <svg class="icon icon-download" viewBox="0 0 32 32">
        <path d="M16 18l8-8h-6v-8h-4v8h-6zM23.273 14.727l-2.242 2.242 8.128 3.031-13.158 4.907-13.158-4.907 8.127-3.031-2.242-2.242-8.727 3.273v8l16 6 16-6v-8z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.active {
  background-color: forestgreen;
}
</style>
