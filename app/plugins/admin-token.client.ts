import { useAdminToken } from '@/composables/useAdminToken'

export default defineNuxtPlugin(() => {
  useAdminToken().start()
})
