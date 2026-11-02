<script setup lang="ts">
import { useComposition } from '@/composables/useComposition'
import { useToast } from '@/composables/useToast'

// TODO: Refactor into adapter for different methods of retrieving sticker URLs
const images = Object.values(
  import.meta.glob<string>('@/assets/sticker/*.{png,jpg,jpeg,svg}', {
    eager: true,
    query: '?url',
    import: 'default'
  })
)

const { hasImage, addSticker } = useComposition()
const toast = useToast()

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
    <div id="sticker-list" :class="{ disabled: !hasImage }">
      <div v-for="image in images" :key="image" class="image-wrapper">
        <img :src="image" alt="Sticker" @click="onStickerClick(image)">
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
