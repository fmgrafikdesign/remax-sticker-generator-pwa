/** Sticker ids are ULIDs: 10 chars of millisecond time + 16 chars of randomness, Crockford base32. */
export const STICKER_ID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/

/** Longest side of a stored sticker; larger uploads are scaled down. */
export const MAX_STICKER_SIZE = 2048
/** Longest side of the thumbnail shown in the sticker list. */
export const THUMBNAIL_SIZE = 400
/** Upper bound for a stored (converted) sticker. */
export const MAX_STICKER_BYTES = 2 * 1024 * 1024
/** Upper bound for the raw upload before conversion. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

export interface StickerInfo {
  id: string
  /** Full-size image, used when placing the sticker. */
  url: string
  /** Small preview, used in sticker lists. */
  thumbnailUrl: string
}

export function stickerInfo(id: string): StickerInfo {
  return { id, url: `/stickers/${id}.webp`, thumbnailUrl: `/stickers/${id}.thumb.webp` }
}
