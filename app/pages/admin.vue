<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppTitle from '@/components/AppTitle.vue'
import { useAdminToken, type AdminStatus } from '@/composables/useAdminToken'
import { useStickerCatalog } from '@/composables/useStickerCatalog'
import { useToast } from '@/composables/useToast'

const admin = useAdminToken()
const catalog = useStickerCatalog()
const toast = useToast()

const tokenInput = ref(admin.token.value)
const uploading = ref(false)
const deleting = ref<string | null>(null)

const statusText: Record<AdminStatus, string> = {
  none: 'Kein Zugangscode gespeichert.',
  checking: 'Zugangscode wird geprüft …',
  valid: 'Zugangscode gültig.',
  invalid: 'Zugangscode ungültig.',
  unreachable: 'Server nicht erreichbar. Der Code wird erneut geprüft, sobald du wieder online bist.'
}
const isAdmin = computed(() => admin.status.value === 'valid')

onMounted(() => {
  tokenInput.value = admin.token.value
  void catalog.load()
})

async function checkToken() {
  await admin.setToken(tokenInput.value)
}

function logout() {
  admin.forget()
  tokenInput.value = ''
}

/** Error text from an h3 error response, falling back to a generic message. */
async function errorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json()
    return body.statusMessage || body.message || fallback
  } catch {
    return fallback
  }
}

async function adminRequest(url: string, init: RequestInit): Promise<Response | null> {
  let response: Response
  try {
    response = await fetch(url, { ...init, headers: admin.authHeaders() })
  } catch {
    toast.warning('Keine Verbindung zum Server.')
    return null
  }
  if (response.status === 401) {
    admin.rejectToken()
    toast.warning('Zugangscode ungültig.')
    return null
  }
  return response
}

async function onFilesChosen(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]
  input.value = ''
  if (files.length === 0) return
  uploading.value = true
  let uploaded = 0
  for (const file of files) {
    const body = new FormData()
    body.append('file', file)
    const response = await adminRequest('/api/admin/stickers', { method: 'POST', body })
    if (!response) break
    if (response.ok) uploaded++
    else toast.warning(`${file.name}: ${await errorMessage(response, 'Hochladen fehlgeschlagen.')}`, 5000)
  }
  uploading.value = false
  if (uploaded > 0) toast.success(uploaded === 1 ? 'Sticker hochgeladen!' : `${uploaded} Sticker hochgeladen!`)
  await catalog.load()
}

async function deleteSticker(id: string) {
  if (!window.confirm('Diesen Sticker für alle löschen?')) return
  deleting.value = id
  const response = await adminRequest(`/api/admin/stickers/${id}`, { method: 'DELETE' })
  deleting.value = null
  if (response?.ok) toast.success('Sticker gelöscht.')
  else if (response) toast.warning(await errorMessage(response, 'Löschen fehlgeschlagen.'))
  await catalog.load()
}
</script>

<template>
  <div class="frame admin">
    <AppTitle />
    <NuxtLink to="/" class="back-link">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
      </svg>
      Zurück zum Generator
    </NuxtLink>

    <main class="admin-content">
      <div class="admin-intro">
        <p class="eyebrow">Redaktion</p>
        <h2 class="admin-heading">Verwaltung.</h2>
      </div>

      <section class="panel">
        <p class="eyebrow">01 — Zugang</p>
        <h2 class="panel-title">Zugang</h2>
        <form class="token-form" @submit.prevent="checkToken">
          <input
            v-model="tokenInput"
            class="token-input"
            type="password"
            autocomplete="off"
            placeholder="Zugangscode"
            aria-label="Zugangscode"
          >
          <button class="btn btn--primary" type="submit">Prüfen</button>
          <button v-if="admin.token.value" class="btn" type="button" @click="logout">Abmelden</button>
        </form>
        <p class="token-status" :class="`status-${admin.status.value}`" data-testid="token-status">
          <span class="status-dot" aria-hidden="true" />
          {{ statusText[admin.status.value] }}
        </p>
      </section>

      <section v-if="isAdmin" class="panel" data-testid="sticker-management">
        <p class="eyebrow">02 — Bibliothek</p>
        <div class="panel-heading">
          <h2 class="panel-title">Sticker verwalten</h2>
          <span v-if="catalog.stickers.value.length" class="count">{{ catalog.stickers.value.length }}</span>
        </div>
        <p class="hint">PNG oder WebP. Transparenz bleibt erhalten; große Bilder werden auf max. 2048 px verkleinert und komprimiert.</p>
        <label class="btn btn--primary upload-button" :class="{ busy: uploading }">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          {{ uploading ? 'Lädt hoch …' : 'Sticker hochladen' }}
          <input class="sr-only" type="file" accept="image/png,image/webp" multiple :disabled="uploading" @change="onFilesChosen">
        </label>

        <p v-if="catalog.state.value === 'error'" class="hint">Sticker konnten nicht geladen werden.</p>
        <ul class="sticker-grid">
          <li v-for="sticker in catalog.stickers.value" :key="sticker.id" class="sticker-tile">
            <img :src="sticker.thumbnailUrl" alt="Sticker" loading="lazy">
            <button
              class="btn btn--danger btn--sm"
              type="button"
              :disabled="deleting === sticker.id"
              @click="deleteSticker(sticker.id)"
            >
              Löschen
            </button>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.admin-content {
  max-width: 60rem;
  padding: 2rem var(--page-gutter) 4rem;
}

/* A full-width cell under the header, ruled like the toolbar. */
.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem var(--page-gutter);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 1px solid var(--line-strong);
}

.back-link .icon {
  width: 1rem;
  height: 1rem;
}

.back-link:hover {
  color: var(--ink);
  background-color: var(--surface-3);
}

.back-link:focus-visible {
  box-shadow: inset 0 0 0 2px var(--accent);
}

.admin-intro {
  margin-bottom: 2rem;
}

.admin-heading {
  margin-top: 0.5rem;
  font-size: clamp(2.25rem, 1.25rem + 4vw, 3.5rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.045em;
}

.panel {
  overflow: hidden;
  padding: 1.5rem;
  background-color: var(--surface);
  border: 1px solid var(--line-strong);
}

/* neighbouring panels share one rule */
.panel + .panel {
  margin-top: -1px;
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.panel-title {
  margin-top: 0.375rem;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.count {
  margin-top: 0.375rem;
  padding: 0 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--ink-soft);
  background-color: var(--surface-3);
  border: 1px solid var(--line);
}

.token-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.token-input {
  flex: 1 1 14rem;
  min-height: 2.75rem;
  padding: 0 1.125rem;
  background-color: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: 0;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.token-input::placeholder {
  color: var(--muted);
}

.token-input:hover {
  border-color: var(--muted);
}

.token-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-tint-strong);
}

.token-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.875rem;
  padding: 0.25rem 0.75rem 0.25rem 0.625rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--ink-soft);
  background-color: var(--surface-3);
  border: 1px solid var(--line);
}

.status-dot {
  flex: none;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--muted);
  border-radius: 0;
}

.status-valid { color: var(--success); background-color: var(--success-tint); }
.status-valid .status-dot { background-color: var(--success); }
.status-invalid { color: var(--danger); background-color: var(--danger-tint); }
.status-invalid .status-dot { background-color: var(--danger); }

.hint {
  margin: 0.5rem 0 1rem;
  max-width: 40rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--muted);
}

.upload-button {
  cursor: pointer;
}

.upload-button:has(input:focus-visible) {
  box-shadow: var(--focus-ring);
}

.upload-button.busy {
  opacity: 0.6;
  cursor: progress;
}

/* Ruled grid running edge to edge of the panel, like the library on the generator page. */
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  margin: 1.5rem calc(-1.5rem - 1px) calc(-1.5rem - 1px) -1.5rem;
  border-top: 1px solid var(--line-strong);
}

.sticker-tile {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
}

.sticker-tile img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  padding: 0.75rem;
  /* checkerboard shows transparency */
  background: var(--checker);
}

.sticker-tile .btn {
  width: 100%;
  border-width: 1px 0 0;
}
</style>
