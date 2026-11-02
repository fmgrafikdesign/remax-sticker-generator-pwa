<script setup lang="ts">
import ImageCanvas from '@/components/ImageCanvas.vue'
import StickerList from '@/components/StickerList.vue'
import ToastHost from '@/components/ToastHost.vue'
import { provideComposition } from '@/composables/useComposition'

provideComposition()
</script>

<template>
  <div id="app">
    <ImageCanvas />
    <hr>
    <StickerList />
    <ToastHost />
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
