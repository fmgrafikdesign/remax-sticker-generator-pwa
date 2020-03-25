<template>
  <div class="image-wrapper h100">
    <ImageCanvas />
  </div>
</template>

<script>
import ImageCanvas from './ImageCanvas'
export default {
  name: 'ImageWrapper',
  components: { ImageCanvas }
}
</script>

<style scoped>
  .image-wrapper {
    position: relative;
    background-color: #fbfcff;
  }
</style>
