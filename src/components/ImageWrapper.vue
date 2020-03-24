<template>
  <div class="image-wrapper">
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
    height: 100vh;
    background-color: #fbfcff;
  }
</style>
