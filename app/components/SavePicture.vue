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
  <!-- Stays clickable while inactive so the click can explain what is missing. -->
  <button class="btn btn--primary" type="button" :aria-disabled="!active" @click="savePicture">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
    <span>Speichern</span>
  </button>
</template>
