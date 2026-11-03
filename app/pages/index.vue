<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import ImageCanvas from '@/components/ImageCanvas.vue'
import StickerList from '@/components/StickerList.vue'
import { provideComposition } from '@/composables/useComposition'

const { hasImage } = provideComposition()
</script>

<template>
  <div class="generator">
    <AppTitle />
    <main class="workspace">
      <ImageCanvas class="workspace-stage" :class="{ 'has-image': hasImage }" />
      <StickerList class="workspace-library" />
    </main>
  </div>
</template>

<style scoped>
/* Phone: the sticker list sits directly on a white page. */
.generator {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: #fff;
}

.workspace {
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* The editor fills the first screen until a photo is chosen. */
.workspace-stage {
  height: calc(100dvh - var(--header-h));
  min-height: 28rem;
}

/* With a photo, it pins to the top at half height so stickers show up live while browsing the list below. */
.workspace-stage.has-image {
  position: sticky;
  top: 0;
  z-index: 5;
  height: max(52dvh, 20rem);
  min-height: 0;
  box-shadow: 0 10px 24px -14px rgb(15 27 45 / 35%);
}

/* Desktop: editor and library sit side by side and scroll independently. */
@media (min-width: 60rem) {
  .generator {
    background-color: transparent;
  }

  .workspace {
    display: grid;
    flex: none;
    grid-template-columns: minmax(0, 1fr) clamp(21rem, 30vw, 28rem);
    grid-template-rows: minmax(0, 1fr);
    gap: 1.5rem;
    align-items: stretch;
    width: 100%;
    max-width: 100rem;
    height: calc(100dvh - var(--header-h));
    margin: 0 auto;
    padding: 1.5rem var(--page-gutter);
  }

  .workspace-stage,
  .workspace-stage.has-image,
  .workspace-library {
    position: static;
    height: 100%;
    min-height: 0;
    margin: 0;
    box-shadow: none;
  }
}
</style>
