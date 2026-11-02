<script setup lang="ts">
import ChoseAnotherPicture from '@/components/ChoseAnotherPicture.vue'
import DeleteSticker from '@/components/DeleteSticker.vue'
import SavePicture from '@/components/SavePicture.vue'
import { useComposition } from '@/composables/useComposition'

const { hasImage } = useComposition()
</script>

<template>
  <div class="canvas-bottom-bar d-flex align-contents-center">
    <DeleteSticker />
    <ChoseAnotherPicture v-if="hasImage" />
    <SavePicture />
  </div>
</template>
