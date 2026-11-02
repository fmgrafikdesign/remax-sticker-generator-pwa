import {
  computed,
  inject,
  provide,
  ref,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type Ref,
  type ShallowRef
} from 'vue'

export interface StickerEntry {
  id: number
  url: string
}

export interface Composition {
  /** Object URL of the current photo, or '' while none is chosen. */
  imageUrl: Ref<string>
  /** File name of the current photo. */
  filename: Ref<string>
  stickers: Ref<StickerEntry[]>
  selectedId: Ref<number | null>
  /** The element holding the photo and its stickers; this is what gets rendered on save. */
  compositionEl: ShallowRef<HTMLElement | null>
  hasImage: ComputedRef<boolean>
  /** Replaces the photo. Stickers belong to a photo, so they are discarded with it. */
  setImage(file: File): void
  /** Adds a sticker and selects it. Returns false when there is no photo to put it on. */
  addSticker(url: string): boolean
  selectSticker(id: number): void
  deleteSelectedSticker(): void
}

export function createComposition(): Composition {
  const imageUrl = ref('')
  const filename = ref('')
  const stickers = ref<StickerEntry[]>([])
  const selectedId = ref<number | null>(null)
  const compositionEl = shallowRef<HTMLElement | null>(null)
  let nextStickerId = 0

  const hasImage = computed(() => imageUrl.value !== '')

  function setImage(file: File) {
    if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
    imageUrl.value = URL.createObjectURL(file)
    filename.value = file.name
    stickers.value = []
    selectedId.value = null
  }

  function addSticker(url: string): boolean {
    if (!hasImage.value) return false
    const id = nextStickerId++
    stickers.value.push({ id, url })
    selectedId.value = id
    return true
  }

  function selectSticker(id: number) {
    selectedId.value = id
  }

  function deleteSelectedSticker() {
    stickers.value = stickers.value.filter(sticker => sticker.id !== selectedId.value)
    selectedId.value = null
  }

  return {
    imageUrl,
    filename,
    stickers,
    selectedId,
    compositionEl,
    hasImage,
    setImage,
    addSticker,
    selectSticker,
    deleteSelectedSticker
  }
}

const compositionKey: InjectionKey<Composition> = Symbol('composition')

/** Call once in the root component; descendants read it via `useComposition()`. */
export function provideComposition(): Composition {
  const composition = createComposition()
  provide(compositionKey, composition)
  return composition
}

export function useComposition(): Composition {
  const composition = inject(compositionKey)
  if (!composition) throw new Error('useComposition() requires provideComposition() in an ancestor')
  return composition
}

/** "holiday.jpeg" -> "holiday-stickers.jpg" */
export function stickerFilename(originalName: string): string {
  return originalName.replace(/\.[^/.]+$/, '') + '-stickers.jpg'
}
