import sharp from 'sharp'
import { MAX_STICKER_BYTES, MAX_STICKER_SIZE, THUMBNAIL_SIZE } from '../../shared/stickers.ts'
import type { StickerFiles } from './s3.ts'

export class StickerRejectedError extends Error {}

const ACCEPTED_FORMATS = new Set(['png', 'webp'])

/**
 * Converts an uploaded PNG/WebP into the stored sticker (WebP, at most MAX_STICKER_SIZE on the longest side)
 * and its thumbnail. Transparency and transparent padding are kept; images are never enlarged.
 */
export async function processSticker(input: Buffer): Promise<StickerFiles> {
  let format: string | undefined
  try {
    format = (await sharp(input).metadata()).format
  } catch {
    throw new StickerRejectedError('Die Datei ist kein lesbares Bild.')
  }
  if (!format || !ACCEPTED_FORMATS.has(format)) throw new StickerRejectedError('Nur PNG- oder WebP-Bilder werden unterstützt.')

  const fit = (size: number) => ({ width: size, height: size, fit: 'inside' as const, withoutEnlargement: true })
  const [sticker, thumbnail] = await Promise.all([
    sharp(input).rotate().resize(fit(MAX_STICKER_SIZE)).webp({ quality: 90, alphaQuality: 100 }).toBuffer(),
    sharp(input).rotate().resize(fit(THUMBNAIL_SIZE)).webp({ quality: 85, alphaQuality: 100 }).toBuffer()
  ])
  if (sticker.length > MAX_STICKER_BYTES) {
    throw new StickerRejectedError('Das Bild ist auch nach der Komprimierung größer als 2 MB.')
  }
  return { sticker, thumbnail }
}
