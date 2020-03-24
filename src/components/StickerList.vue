<template>
  <div class="sticker-list-wrapper">
    <h4>Berühren zum Hinzufügen</h4>
  <div id="sticker-list">
    <div v-for="image in images" :key="image" class="image-wrapper">
      <img :src="image" @click="addSticker(image)">
    </div>
  </div>
  </div>
</template>

<script>

// TODO: Refactor into adapter for different methods of retrieving sticker URLs
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
      somelist: [1, 2, 3, 4]
    }
  },
  methods: {
    addSticker: (sticker) => {
      console.log('clicked on sticker: ', sticker)
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
