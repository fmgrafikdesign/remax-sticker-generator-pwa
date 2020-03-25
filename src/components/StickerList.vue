<template>
  <div class="sticker-list-wrapper">
    <h4>Berühren zum Hinzufügen</h4>
  <div id="sticker-list" v-bind:class="{disabled: !imageAvailable}">
    <div v-for="image in images" :key="image" class="image-wrapper">
      <img :src="image" @click="addSticker(image)">
    </div>
  </div>
  </div>
</template>

<script>

// TODO: Refactor into adapter for different methods of retrieving sticker URLs
import ImageCanvas from '@/components/ImageCanvas'
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
      console.log('image available now')
      this.imageAvailable = true
    })
  },
  methods: {
    addSticker: (sticker) => {
      EventBus.$emit('sticker-added', sticker)
    }
  }
}
</script>

<style scoped>
  #sticker-list {
    display: block;
  }

  .image-wrapper {
    width: 50%;
    padding: 4px;
    display: inline-block;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
</style>
