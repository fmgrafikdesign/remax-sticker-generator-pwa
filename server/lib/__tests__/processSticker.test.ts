import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { processSticker, StickerRejectedError } from '../processSticker'

/** Transparent canvas with an opaque red square in the middle (transparent padding around it). */
const paddedPng = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{
      input: { create: { width: Math.round(width / 2), height: Math.round(height / 2), channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } } },
      gravity: 'centre'
    }])
    .png()
    .toBuffer()

const pixelAlpha = async (image: Buffer, x: number, y: number) => {
  const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return data[(y * info.width + x) * 4 + 3]
}

describe('processSticker', () => {
  it('stores WebP with transparency and padding intact', async () => {
    const { sticker } = await processSticker(await paddedPng(600, 300))
    const meta = await sharp(sticker).metadata()
    expect(meta).toMatchObject({ format: 'webp', width: 600, height: 300, hasAlpha: true })
    expect(await pixelAlpha(sticker, 5, 5)).toBe(0)
    expect(await pixelAlpha(sticker, 300, 150)).toBe(255)
  })

  it('scales the longest side down to 2048 px and never enlarges', async () => {
    const wide = (await processSticker(await paddedPng(4096, 1024))).sticker
    const big = await sharp(wide).metadata()
    expect([big.width, big.height]).toEqual([2048, 512])
    const narrow = (await processSticker(await paddedPng(1000, 3000))).sticker
    const tall = await sharp(narrow).metadata()
    expect([tall.width, tall.height]).toEqual([683, 2048])
  })

  it('makes a thumbnail of at most 400 px', async () => {
    const { thumbnail } = await processSticker(await paddedPng(1600, 800))
    const meta = await sharp(thumbnail).metadata()
    expect([meta.format, meta.width, meta.height]).toEqual(['webp', 400, 200])
  })

  it('rejects JPEGs and non-images', async () => {
    const jpeg = await sharp({ create: { width: 10, height: 10, channels: 3, background: '#fff' } }).jpeg().toBuffer()
    await expect(processSticker(jpeg)).rejects.toBeInstanceOf(StickerRejectedError)
    await expect(processSticker(Buffer.from('<html></html>'))).rejects.toBeInstanceOf(StickerRejectedError)
  })
})
