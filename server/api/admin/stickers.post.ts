import { putSticker } from '../../lib/s3.ts'
import { createUlid } from '../../lib/ulid.ts'
import { processSticker, StickerRejectedError } from '../../lib/processSticker.ts'
import { MAX_UPLOAD_BYTES, stickerInfo } from '../../../shared/stickers.ts'

export default defineEventHandler(async event => {
  requireAdmin(event)
  if (Number(getRequestHeader(event, 'content-length') ?? 0) > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Die Datei ist größer als 20 MB.' })
  }
  const file = (await readMultipartFormData(event))?.find(part => part.name === 'file')
  if (!file?.data.length) throw createError({ statusCode: 400, statusMessage: 'Keine Datei hochgeladen.' })

  try {
    const id = createUlid()
    await putSticker(useStickerBucket(), id, await processSticker(file.data))
    setResponseStatus(event, 201)
    return stickerInfo(id)
  } catch (error) {
    if (error instanceof StickerRejectedError) throw createError({ statusCode: 422, statusMessage: error.message })
    throw error
  }
})
