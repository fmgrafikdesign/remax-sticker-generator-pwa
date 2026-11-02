import { listStickerIds } from '../lib/s3.ts'
import { stickerInfo } from '../../shared/stickers.ts'

export default defineEventHandler(async () => (await listStickerIds(useStickerBucket())).map(stickerInfo))
