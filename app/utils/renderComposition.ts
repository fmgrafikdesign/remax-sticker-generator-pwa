/** Longest side of the saved picture, in pixels. Larger photos are scaled down (keeps canvases within mobile limits). */
export const MAX_OUTPUT_SIZE = 2000

/** Scales `width` x `height` down to fit `max` on the longest side; never scales up. */
export function fitWithin(width: number, height: number, max: number): { width: number, height: number } {
  const factor = Math.min(1, max / Math.max(width, height))
  return { width: Math.round(width * factor), height: Math.round(height * factor) }
}

/**
 * Renders the photo with its stickers onto a canvas, at the photo's resolution but at most
 * `MAX_OUTPUT_SIZE` on the longest side.
 *
 * Reads the live DOM (positions, CSS transforms) but never re-fetches anything, so it works offline,
 * regardless of scroll position and without cloning the page.
 */
export async function renderComposition(composition: HTMLElement): Promise<Blob> {
  const photo = composition.querySelector<HTMLImageElement>('img.preview-image')
  if (!photo) throw new Error('Composition has no photo')
  await photo.decode()

  const size = fitWithin(photo.naturalWidth, photo.naturalHeight, MAX_OUTPUT_SIZE)
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas is not available')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(photo, 0, 0, size.width, size.height)

  // CSS px on screen -> pixels of the output
  const scale = size.width / photo.getBoundingClientRect().width

  // DOM order is stacking order
  for (const sticker of composition.querySelectorAll<HTMLElement>('.placed-sticker')) {
    const image = sticker.querySelector('img')
    if (!image) continue
    await image.decode()

    const style = getComputedStyle(sticker)
    const matrix = new DOMMatrix(style.transform)
    const [originX = 0, originY = 0] = style.transformOrigin.split(' ').map(parseFloat)

    ctx.save()
    ctx.scale(scale, scale)
    // CSS applies: translate to box position, move to the transform origin, transform, move back
    ctx.translate(sticker.offsetLeft + originX, sticker.offsetTop + originY)
    ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f)
    ctx.translate(-originX, -originY)
    ctx.drawImage(image, 0, 0, sticker.offsetWidth, sticker.offsetHeight)
    ctx.restore()
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))), 'image/jpeg')
  })
}
