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
/* A row of full-height cells divided by hairlines, as tall as the header so the rules line up across the page. */
.toolbar {
  display: flex;
  align-items: stretch;
  height: var(--header-h);
  background-color: var(--surface);
  border-top: 1px solid var(--line-strong);
}

.toolbar-actions {
  display: flex;
  align-items: stretch;
  margin-left: auto;
}

.toolbar .btn {
  height: 100%;
  min-height: 0;
  border-width: 0 0 0 1px;
}

.toolbar > .btn {
  border-width: 0 1px 0 0;
}
</style>
