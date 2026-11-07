<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import ImageCanvas from '@/components/ImageCanvas.vue'
import StickerList from '@/components/StickerList.vue'
import { provideComposition } from '@/composables/useComposition'

const { hasImage } = provideComposition()
</script>

<template>
  <div class="frame generator">
    <AppTitle />
    <main class="workspace">
      <ImageCanvas class="workspace-stage" :class="{ 'has-image': hasImage }" />
      <StickerList class="workspace-library" />
    </main>
  </div>
</template>

<style scoped>
/* Phone: editor on top, the sticker list below it on the same white page. */
.generator {
  display: flex;
  flex-direction: column;
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
  border-bottom: 1px solid var(--line-strong);
}

/* Desktop: editor and library sit side by side, divided by a hairline, and scroll independently. */
@media (min-width: 60rem) {
  .generator {
    height: 100dvh;
  }

  .workspace {
    display: grid;
    flex: 1;
    grid-template-columns: minmax(0, 1fr) clamp(21rem, 30vw, 26rem);
    grid-template-rows: minmax(0, 1fr);
    min-height: 0;
  }

  .workspace-stage,
  .workspace-stage.has-image,
  .workspace-library {
    position: static;
    height: 100%;
    min-height: 0;
    margin: 0;
    border-bottom: 0;
  }
}
</style>
