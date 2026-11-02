import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { createUlid } from './ulid.ts'
import { processSticker } from './processSticker.ts'
import {
  SEED_MARKER_KEY,
  deleteKeys,
  headMetadata,
  listKeys,
  putSticker,
  stickerKey,
  thumbnailKey,
  type StickerBucket
} from './s3.ts'

/** Seeded stickers share this timestamp, so they always sort as the oldest stickers. */
const SEED_TIME = Date.UTC(2020, 0, 1)

/** Stable id per file name: re-seeding never creates duplicates. */
export function seedStickerId(fileName: string): string {
  return createUlid(SEED_TIME, createHash('sha256').update(fileName).digest().subarray(0, 10))
}

export type SeedMode = 'dev' | 'prod'

export interface SeedResult {
  skipped: boolean
  written: string[]
  unchanged: string[]
  deleted: string[]
}

/**
 * dev: the bucket ends up holding exactly the default stickers (uploads are deleted, changed defaults rewritten).
 * prod: seeds once; does nothing if the seed marker exists, so deleted defaults stay deleted.
 */
export async function seed(store: StickerBucket, mode: SeedMode, directory: string): Promise<SeedResult> {
  const result: SeedResult = { skipped: false, written: [], unchanged: [], deleted: [] }
  await ensureBucket(store, mode)

  if (mode === 'prod' && (await headMetadata(store, SEED_MARKER_KEY)) !== null) {
    return { ...result, skipped: true }
  }

  const files = (await readdir(directory)).filter(name => /\.(png|webp)$/i.test(name)).sort()
  const seedIds = new Set<string>()

  for (const file of files) {
    const id = seedStickerId(basename(file))
    seedIds.add(id)
    const source = await readFile(join(directory, file))
    const sourceHash = createHash('sha256').update(source).digest('hex')
    const existing = await headMetadata(store, stickerKey(id))
    if (existing?.['source-sha256'] === sourceHash && (await headMetadata(store, thumbnailKey(id))) !== null) {
      result.unchanged.push(file)
      continue
    }
    await putSticker(store, id, await processSticker(source), { 'source-sha256': sourceHash, 'seed-file': file })
    result.written.push(file)
  }

  if (mode === 'dev') {
    const keep = new Set([...seedIds].flatMap(id => [stickerKey(id), thumbnailKey(id)]))
    const stale = [...(await listKeys(store, 'stickers/')), ...(await listKeys(store, 'thumbs/'))].filter(key => !keep.has(key))
    await deleteKeys(store, stale)
    result.deleted = stale
  }

  await store.client.send(new PutObjectCommand({ Bucket: store.bucket, Key: SEED_MARKER_KEY, Body: new Date(SEED_TIME).toISOString() }))
  return result
}

async function ensureBucket({ client, bucket }: StickerBucket, mode: SeedMode) {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch (error) {
    // Only a local dev bucket gets created; a missing production bucket is a configuration error.
    if (mode !== 'dev') throw error
    await client.send(new CreateBucketCommand({ Bucket: bucket }))
  }
}
