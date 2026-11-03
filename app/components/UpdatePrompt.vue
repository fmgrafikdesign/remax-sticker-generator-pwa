<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

// undefined while no service worker plugin is active (e.g. in dev)
const pwa = usePWA()

/** A phone app resumed from the background does no navigation, so ask for a new version explicitly. */
function checkForUpdate() {
  if (document.visibilityState !== 'visible') return
  // update() rejects while offline; there is nothing to do then
  pwa?.getSWRegistration()?.update().catch(() => {})
}

onMounted(() => document.addEventListener('visibilitychange', checkForUpdate))
onBeforeUnmount(() => document.removeEventListener('visibilitychange', checkForUpdate))
</script>

<template>
  <Transition name="update">
    <div v-if="pwa?.needRefresh" class="update-prompt" role="status">
      <div class="update-copy">
        <p class="update-title">Neue Version verfügbar</p>
        <p class="update-text">Beim Aktualisieren geht ein nicht gespeichertes Bild verloren.</p>
      </div>
      <div class="update-actions">
        <button class="btn btn--sm" type="button" @click="pwa.cancelPrompt()">Später</button>
        <button class="btn btn--primary btn--sm" type="button" @click="pwa.updateServiceWorker(true)">
          Jetzt aktualisieren
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.update-prompt {
  position: fixed;
  right: 0.75rem;
  bottom: 0.75rem;
  left: 0.75rem;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 26rem;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}

.update-title {
  font-weight: 700;
}

.update-text {
  margin-top: 0.125rem;
  font-size: 0.9375rem;
  line-height: 1.4;
  color: var(--muted);
}

.update-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.update-enter-active,
.update-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.update-enter-from,
.update-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}

/* Desktop: a corner card instead of a full-width sheet. */
@media (min-width: 60rem) {
  .update-prompt {
    right: 1.5rem;
    bottom: 1.5rem;
    left: auto;
    margin: 0;
  }
}
</style>
