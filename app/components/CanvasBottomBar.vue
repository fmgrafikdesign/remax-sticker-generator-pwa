<script setup lang="ts">
import ChoseAnotherPicture from '@/components/ChoseAnotherPicture.vue'
import DeleteSticker from '@/components/DeleteSticker.vue'
import SavePicture from '@/components/SavePicture.vue'
import { useComposition } from '@/composables/useComposition'

const { hasImage } = useComposition()
</script>

<template>
  <div class="toolbar">
    <ChoseAnotherPicture v-if="hasImage" />
    <div class="toolbar-actions">
      <DeleteSticker />
      <SavePicture />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem var(--page-gutter);
  background-color: var(--surface);
  border-top: 1px solid var(--line);
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}
</style>
