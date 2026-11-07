<script setup lang="ts">
import { computed } from 'vue'
import { useComposition } from '@/composables/useComposition'

const { selectedId, deleteSelectedSticker } = useComposition()
const active = computed(() => selectedId.value !== null)
</script>

<template>
  <button
    class="btn btn--danger"
    type="button"
    aria-label="Ausgewählten Sticker löschen"
    :disabled="!active"
    @click="deleteSelectedSticker"
  >
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="m5 7 1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
    <span class="label">Löschen</span>
  </button>
</template>

<style scoped>
/* Icon-only on narrow phones; the aria-label keeps it named. */
@media (max-width: 27rem) {
  .label {
    display: none;
  }

  .btn {
    padding: 0;
    width: 3.5rem;
  }
}
</style>
