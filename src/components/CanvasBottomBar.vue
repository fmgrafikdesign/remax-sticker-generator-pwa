<template>
  <div class="canvas-bottom-bar d-flex align-contents-center">
    <!-- Delete -->
  <DeleteSticker />
  <!-- Chose another image -->
    <ChoseAnotherPicture v-on:changePreview="emitToParent" v-if="imageData.length > 0" />
  <!-- save composition -->
    <SavePicture />
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
    selectedSticker: String
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
