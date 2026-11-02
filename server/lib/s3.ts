import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { STICKER_ID_PATTERN } from '../../shared/stickers.ts'

/** Configured from S3_* env vars, both in the Nuxt server and the seed script. */
export interface StickerBucket {
  client: S3Client
  bucket: string
}

export function bucketFromEnv(env: NodeJS.ProcessEnv = process.env): StickerBucket {
  const required = (name: string) => {
    const value = env[name]
    if (!value) throw new Error(`Missing env var ${name}`)
    return value
  }
  return {
    bucket: required('S3_BUCKET'),
    client: new S3Client({
      endpoint: required('S3_ENDPOINT'),
      region: env.S3_REGION || 'auto',
      forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true',
      credentials: {
        accessKeyId: required('S3_ACCESS_KEY_ID'),
        secretAccessKey: required('S3_SECRET_ACCESS_KEY')
      }
    })
  }
}

export const stickerKey = (id: string) => `stickers/${id}.webp`
export const thumbnailKey = (id: string) => `thumbs/${id}.webp`
export const SEED_MARKER_KEY = 'meta/seeded'

export async function listKeys({ client, bucket }: StickerBucket, prefix: string): Promise<string[]> {
  const keys: string[] = []
  let token: string | undefined
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }))
    for (const object of page.Contents ?? []) if (object.Key) keys.push(object.Key)
    token = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (token)
  return keys
}

/** Sticker ids, newest first (ULIDs sort chronologically). */
export async function listStickerIds(store: StickerBucket): Promise<string[]> {
  return (await listKeys(store, 'stickers/'))
    .map(key => key.slice('stickers/'.length, -'.webp'.length))
    .filter(id => STICKER_ID_PATTERN.test(id))
    .sort()
    .reverse()
}

export interface StickerFiles {
  sticker: Buffer
  thumbnail: Buffer
}

export async function putSticker({ client, bucket }: StickerBucket, id: string, files: StickerFiles, metadata: Record<string, string> = {}) {
  // thumbnail first: a listed sticker always has its thumbnail
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: thumbnailKey(id), Body: files.thumbnail, ContentType: 'image/webp' }))
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: stickerKey(id), Body: files.sticker, ContentType: 'image/webp', Metadata: metadata }))
}

export async function deleteKeys({ client, bucket }: StickerBucket, keys: string[]) {
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000)
    if (batch.length === 0) continue
    await client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: batch.map(Key => ({ Key })) } }))
  }
}

export async function deleteSticker(store: StickerBucket, id: string) {
  await deleteKeys(store, [stickerKey(id), thumbnailKey(id)])
}

/** User metadata of an object, or null if it doesn't exist. */
export async function headMetadata({ client, bucket }: StickerBucket, key: string): Promise<Record<string, string> | null> {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return head.Metadata ?? {}
  } catch (error) {
    if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) return null
    throw error
  }
}

export async function getObject({ client, bucket }: StickerBucket, key: string) {
  try {
    return await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
    if (status === 404 || (error as Error).name === 'NoSuchKey') return null
    throw error
  }
}
