import { deleteSticker } from '../../../lib/s3.ts'
import { STICKER_ID_PATTERN } from '../../../../shared/stickers.ts'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id') ?? ''
  if (!STICKER_ID_PATTERN.test(id)) throw createError({ statusCode: 400, statusMessage: 'Ungültige Sticker-ID.' })
  await deleteSticker(useStickerBucket(), id)
  setResponseStatus(event, 204)
  return null
})
