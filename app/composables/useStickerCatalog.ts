import { ref, type Ref } from 'vue'
import type { StickerInfo } from '../../shared/stickers'

export type CatalogState = 'idle' | 'loading' | 'ready' | 'error'

export interface StickerCatalog {
  /** Newest first. */
  stickers: Ref<StickerInfo[]>
  state: Ref<CatalogState>
  load(): Promise<void>
}

const stickers = ref<StickerInfo[]>([])
const state = ref<CatalogState>('idle')

async function load() {
  state.value = 'loading'
  try {
    const response = await fetch('/api/stickers')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    stickers.value = await response.json()
    state.value = 'ready'
  } catch (error) {
    console.error('Loading stickers failed', error)
    state.value = 'error'
  }
}

/** One shared list for the generator and the admin page. */
export function useStickerCatalog(): StickerCatalog {
  return { stickers, state, load }
}
