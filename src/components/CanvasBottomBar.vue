<template>
  <div class="canvas-bottom-bar d-flex align-contents-center">
    <!-- Delete -->
  <DeleteSticker v-on:deleteSticker="$emit('deleteSticker')" v-bind:active="selectedSticker !== -1" />
  <!-- Chose another image -->
    <ChoseAnotherPicture v-on:changePreview="emitToParent" v-if="imageData.length > 0" />
  <!-- save composition -->
    <SavePicture :stickers="stickers" :filename="filename" v-bind:active="stickers.length > 0" />
  </div>
</template>

<script>
import DeleteSticker from '@/components/DeleteSticker'
import ChoseAnotherPicture from '@/components/ChoseAnotherPicture'
import SavePicture from '@/components/SavePicture'
export default {
  name: 'CanvasBottomBar',
  components: { SavePicture, ChoseAnotherPicture, DeleteSticker },
  props: {
    imageData: String,
    selectedSticker: Number,
    filename: String,
    stickers: Array
  },
  methods: {
    emitToParent: function (event) {
      this.$emit('changePreview', event)
    }
  }
}
</script>

<style scoped>

</style>
