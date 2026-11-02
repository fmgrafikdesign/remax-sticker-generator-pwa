<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="toast-host" role="status" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="`toast-${toast.type}`"
      @click="dismiss(toast.id)"
    >
      {{ toast.message }}
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(100%, 480px);
  z-index: 1000;
  pointer-events: none;
}

.toast {
  margin: 0.5rem;
  padding: 0.875rem 1rem;
  color: #fff;
  font-weight: bold;
  line-height: 1.4;
  box-shadow: 1px 7px 10px 0 rgba(1, 1, 1, .25);
  pointer-events: auto;
  cursor: pointer;
}

.toast-success { background-color: #1b7f3b; }
.toast-info { background-color: #0054a4; }
.toast-warning { background-color: #c0392b; }

.toast-enter-active,
.toast-leave-active {
  transition: opacity .25s, transform .25s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}
</style>
