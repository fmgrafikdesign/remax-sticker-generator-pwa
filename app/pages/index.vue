<script setup lang="ts">
import ImageCanvas from '@/components/ImageCanvas.vue'
import StickerList from '@/components/StickerList.vue'
import { provideComposition } from '@/composables/useComposition'

provideComposition()
</script>

<template>
  <div class="generator">
    <ImageCanvas />
    <hr>
    <StickerList />
    <footer class="manage-footer">
      <NuxtLink to="/admin" class="manage-link">Verwalten</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.generator {
  height: 100%;
}

.manage-footer {
  padding: 2rem 1rem 3rem;
  text-align: center;
}

.manage-link {
  color: #7f8082;
  font-weight: bold;
  font-size: 90%;
  text-decoration: none;
}
</style>
