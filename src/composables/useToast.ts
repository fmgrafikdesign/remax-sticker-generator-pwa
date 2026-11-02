import { ref } from 'vue'

export type ToastType = 'success' | 'info' | 'warning'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

const DEFAULT_TIMEOUT_MS = 3000

const toasts = ref<Toast[]>([])
let nextToastId = 0

function dismiss(id: number) {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

function push(type: ToastType, message: string, timeout = DEFAULT_TIMEOUT_MS) {
  const id = nextToastId++
  toasts.value.push({ id, type, message })
  setTimeout(() => dismiss(id), timeout)
}

export function useToast() {
  return {
    toasts,
    dismiss,
    success: (message: string, timeout?: number) => push('success', message, timeout),
    info: (message: string, timeout?: number) => push('info', message, timeout),
    warning: (message: string, timeout?: number) => push('warning', message, timeout)
  }
}
