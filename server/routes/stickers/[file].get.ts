import { getObject, stickerKey, thumbnailKey } from '../../lib/s3.ts'

const FILE_PATTERN = /^([0-9A-HJKMNP-TV-Z]{26})(\.thumb)?\.webp$/

/** Serves sticker images from the bucket on the app's origin, so drawing them onto a canvas never taints it. */
export default defineEventHandler(async event => {
  const match = FILE_PATTERN.exec(getRouterParam(event, 'file') ?? '')
  if (!match) throw createError({ statusCode: 404 })
  const [, id, thumb] = match
  const object = await getObject(useStickerBucket(), thumb ? thumbnailKey(id!) : stickerKey(id!))
  if (!object?.Body) throw createError({ statusCode: 404 })

  setResponseHeaders(event, {
    'Content-Type': 'image/webp',
    // ids are never reused, so the content behind a URL never changes
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff'
  })
  if (object.ContentLength !== undefined) setResponseHeader(event, 'Content-Length', object.ContentLength)
  return Buffer.from(await object.Body.transformToByteArray())
})
