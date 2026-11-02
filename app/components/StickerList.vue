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
  <div class="sticker-list-wrapper">
    <h2 v-if="hasImage" class="section-title text-center">Tippen zum Hinzufügen</h2>
    <h2 v-else class="section-title text-center">Wähle erst ein Bild aus, um Sticker hinzufügen zu können.</h2>
    <p v-if="catalog.state.value === 'error' && catalog.stickers.value.length === 0" class="section-title text-center">
      Sticker konnten nicht geladen werden.
    </p>
    <div id="sticker-list" :class="{ disabled: !hasImage }">
      <div v-for="sticker in catalog.stickers.value" :key="sticker.id" class="image-wrapper">
        <img :src="sticker.thumbnailUrl" alt="Sticker" loading="lazy" @click="onStickerClick(sticker.url)">
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticker-list-wrapper {
  margin-top: 2rem
}

#sticker-list {
  display: block;
}

.section-title {
  font-weight: bold;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  line-height: 1.5
}

.image-wrapper {
  width: 50%;
  padding: 1rem;
  display: inline-block;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
