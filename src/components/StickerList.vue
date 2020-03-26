<template>
  <div class="sticker-list-wrapper">
    <h2 class="section-title text-center" v-if="imageAvailable">Tippen zum Hinzufügen</h2>
    <h2 class="section-title text-center" v-else>Wähle ein Bild, um Sticker hinzufügen zu können</h2>
    <div id="sticker-list" v-bind:class="{disabled: !imageAvailable}">
    <div v-for="image in images" :key="image" class="image-wrapper">
      <img :src="image" @click="addSticker(image)">
    </div>
  </div>
  </div>
</template>

<script>
// TODO: Refactor into adapter for different methods of retrieving sticker URLs
import { EventBus } from '@/event-bus'

function importAllStickers (stickers) {
  return stickers.keys().map(stickers)
}

const images = importAllStickers(require.context('@/assets/sticker/', true, /\.(png|jpe?g|svg)$/))
// console.log(images)
export default {
  name: 'StickerList',
  data: function () {
    return {
      images: images,
      somelist: [1, 2, 3, 4],
      imageAvailable: false
    }
  },
  created () {
    EventBus.$on('image-available', () => {
      this.imageAvailable = true
    })
  },
  methods: {
    addSticker (sticker) {
      EventBus.$emit('sticker-added', sticker)
    }
  }
}
</script>

<style scoped>
  .sticker-list-wrapper {
    margin-top: 2rem
  }
  #sticker-list {
    display: block;
  }

  .section-title {
    font-weight: bold;
    margin-bottom: 1.5rem
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
