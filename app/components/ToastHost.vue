<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="toast-host" role="status" aria-live="polite">
    <button
      v-for="toast in toasts"
      :key="toast.id"
      type="button"
      class="toast"
      :class="`toast-${toast.type}`"
      @click="dismiss(toast.id)"
    >
      <svg class="icon toast-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="toast.type === 'success'" d="m5 12.5 4.5 4.5L19 7.5" />
        <template v-else-if="toast.type === 'warning'">
          <path d="M12 8v5" />
          <path d="M12 16.5h.01" />
          <circle cx="12" cy="12" r="9.25" />
        </template>
        <template v-else>
          <path d="M12 11v5.5" />
          <path d="M12 7.5h.01" />
          <circle cx="12" cy="12" r="9.25" />
        </template>
      </svg>
      <span class="toast-message">{{ toast.message }}</span>
    </button>
  </TransitionGroup>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 0.75rem;
  left: 50%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  width: min(100% - 1.5rem, 28rem);
  transform: translateX(-50%);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-weight: 600;
  line-height: 1.4;
  text-align: left;
  color: #fff;
  border: 0;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
}

.toast-icon {
  margin-top: 0.125rem;
}

.toast-success { background-color: var(--success); }
.toast-info { background-color: var(--brand); }
.toast-warning { background-color: var(--danger); }

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.toast-leave-active {
  position: absolute;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem) scale(0.98);
}

.toast-move {
  transition: transform 0.25s;
}
</style>
