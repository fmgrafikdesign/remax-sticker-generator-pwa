<script setup lang="ts">
import { useComposition } from '@/composables/useComposition'

const { setImage } = useComposition()

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) setImage(file)
}
</script>

<template>
  <div class="file-upload-form">
    <input id="change-image" class="d-none" type="file" accept="image/*" @change="onFileChange">
    <label for="change-image" class="change-image-label text-center">Bild ändern</label>
  </div>
</template>

<style scoped>
.change-image-label {
  color: #7f8082;
  font-weight: bold;
  font-size: 90%;
  display: block;
}

.file-upload-form {
  width: 100%;
}
</style>
