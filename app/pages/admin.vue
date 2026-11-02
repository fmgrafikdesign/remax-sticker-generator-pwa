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
  <div class="admin">
    <AppTitle />
    <main class="admin-content">
      <NuxtLink to="/" class="back-link">← Zurück zum Generator</NuxtLink>

      <section class="panel">
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
          <button class="admin-button" type="submit">Prüfen</button>
          <button v-if="admin.token.value" class="admin-button secondary" type="button" @click="logout">Abmelden</button>
        </form>
        <p class="token-status" :class="`status-${admin.status.value}`" data-testid="token-status">
          {{ statusText[admin.status.value] }}
        </p>
      </section>

      <section v-if="isAdmin" class="panel" data-testid="sticker-management">
        <h2 class="panel-title">Sticker verwalten</h2>
        <p class="hint">PNG oder WebP. Transparenz bleibt erhalten; große Bilder werden auf max. 2048 px verkleinert und komprimiert.</p>
        <label class="admin-button upload-button" :class="{ busy: uploading }">
          {{ uploading ? 'Lädt hoch …' : 'Sticker hochladen' }}
          <input class="d-none" type="file" accept="image/png,image/webp" multiple :disabled="uploading" @change="onFilesChosen">
        </label>

        <p v-if="catalog.state.value === 'error'" class="hint">Sticker konnten nicht geladen werden.</p>
        <ul class="sticker-grid">
          <li v-for="sticker in catalog.stickers.value" :key="sticker.id" class="sticker-tile">
            <img :src="sticker.thumbnailUrl" alt="Sticker" loading="lazy">
            <button
              class="delete-tile"
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
.admin {
  min-height: 100%;
  background-color: #292b2f;
  color: #dce0ea;
}

.admin-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 1rem;
}

.back-link {
  display: inline-block;
  color: #dce0ea;
  font-weight: bold;
  text-decoration: none;
  margin: 0.5rem 0 1rem;
}

.panel {
  background-color: #34373c;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.panel-title {
  font-weight: bold;
  font-size: 110%;
  margin-bottom: 0.75rem;
}

.token-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.token-input {
  flex: 1 1 12rem;
  padding: 0.6rem 0.75rem;
  font: inherit;
  border: 0;
  border-radius: 4px;
}

.admin-button {
  display: inline-block;
  padding: 0.6rem 1rem;
  font: inherit;
  font-weight: bold;
  color: #fff;
  background-color: #0054a4;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}

.admin-button.secondary {
  background-color: #6b6b6b;
}

.upload-button.busy {
  opacity: 0.6;
  cursor: progress;
}

.token-status,
.hint {
  margin-top: 0.75rem;
  line-height: 1.4;
  font-size: 90%;
}

.status-valid { color: #7bd88f; }
.status-invalid { color: #ff7b72; }

.hint {
  margin-bottom: 0.75rem;
}

.sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.sticker-tile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  /* checkerboard shows transparency */
  background: repeating-conic-gradient(#4a4d52 0% 25%, #3d4045 0% 50%) 50% / 16px 16px;
}

.sticker-tile img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
}

.delete-tile {
  padding: 0.4rem;
  font: inherit;
  font-weight: bold;
  color: #fff;
  background-color: #e11b22;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
</style>
