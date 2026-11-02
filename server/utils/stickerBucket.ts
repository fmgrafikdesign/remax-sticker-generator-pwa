import { bucketFromEnv, type StickerBucket } from '../lib/s3.ts'

let bucket: StickerBucket | undefined

/** Lazily created, so a missing S3 config fails the request instead of the server start. */
export function useStickerBucket(): StickerBucket {
  bucket ??= bucketFromEnv()
  return bucket
}
