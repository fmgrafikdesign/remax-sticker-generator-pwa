<script setup lang="ts">
import { useComposition } from '@/composables/useComposition'

const { setImage } = useComposition()

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) setImage(file)
}
</script>

<template>
  <label class="btn change-image">
    <input class="sr-only" type="file" accept="image/*" @change="onFileChange">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="1.75" />
      <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
    </svg>
    <span>Bild ändern</span>
  </label>
</template>

<style scoped>
.change-image {
  cursor: pointer;
}

.change-image:has(input:focus-visible) {
  box-shadow: var(--focus-ring);
}
</style>
