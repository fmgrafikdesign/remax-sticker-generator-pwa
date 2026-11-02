import { ref, type Ref } from 'vue'

/**
 * none: no token entered · checking: request in flight · valid/invalid: server answer ·
 * unreachable: no answer (offline or server down); the token is kept and re-checked later.
 */
export type AdminStatus = 'none' | 'checking' | 'valid' | 'invalid' | 'unreachable'

export interface AdminToken {
  token: Ref<string>
  status: Ref<AdminStatus>
  /** Stores the token and checks it. */
  setToken(value: string): Promise<void>
  verify(): Promise<void>
  forget(): void
  /** Call when an admin request answered 401. */
  rejectToken(): void
  authHeaders(): Record<string, string>
  /** Loads the stored token, checks it, and re-checks when the app comes back online or into view. */
  start(): void
}

const STORAGE_KEY = 'sticker-admin-token'
const token = ref('')
const status = ref<AdminStatus>('none')
let latestCheck = 0
let started = false

async function verify() {
  const check = ++latestCheck
  if (!token.value) {
    status.value = 'none'
    return
  }
  status.value = 'checking'
  let next: AdminStatus
  try {
    const response = await fetch('/api/admin/session', { headers: authHeaders(), cache: 'no-store' })
    next = response.status === 204 ? 'valid' : response.status === 401 ? 'invalid' : 'unreachable'
  } catch {
    next = 'unreachable'
  }
  if (check !== latestCheck) return // a newer check superseded this one
  if (next === 'invalid') rejectToken()
  else status.value = next
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${token.value}` }
}

async function setToken(value: string) {
  token.value = value.trim()
  if (token.value) localStorage.setItem(STORAGE_KEY, token.value)
  else localStorage.removeItem(STORAGE_KEY)
  await verify()
}

function forget() {
  latestCheck++
  token.value = ''
  localStorage.removeItem(STORAGE_KEY)
  status.value = 'none'
}

function rejectToken() {
  // keep the typed value visible for correcting it, but stop using it on the next start
  localStorage.removeItem(STORAGE_KEY)
  status.value = 'invalid'
}

function start() {
  if (started) return
  started = true
  token.value = localStorage.getItem(STORAGE_KEY) ?? ''
  void verify()
  window.addEventListener('online', () => void verify())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void verify()
  })
}

export function useAdminToken(): AdminToken {
  return { token, status, setToken, verify, forget, rejectToken, authHeaders, start }
}
