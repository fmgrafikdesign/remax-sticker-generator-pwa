import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { beforeEach, describe, expect, it } from 'vitest'
import { SEED_MARKER_KEY, bucketFromEnv, deleteKeys, listKeys, listStickerIds, putSticker } from '../../server/lib/s3'
import { seed, seedStickerId } from '../../server/lib/seed'
import { createUlid } from '../../server/lib/ulid'

const store = bucketFromEnv()
const directory = fileURLToPath(new URL('../../seed/stickers', import.meta.url))
const seedFiles = readdirSync(directory).filter(name => /\.(png|webp)$/i.test(name))
const allKeys = async () => [...await listKeys(store, '')].sort()

describe('seed', () => {
  beforeEach(async () => {
    await seed(store, 'dev', directory) // makes sure the bucket exists
    await deleteKeys(store, await listKeys(store, ''))
  })

  it('dev: running twice yields the same keys and writes nothing the second time', async () => {
    const first = await seed(store, 'dev', directory)
    const keysAfterFirst = await allKeys()
    const second = await seed(store, 'dev', directory)

    expect(first.written).toHaveLength(seedFiles.length)
    expect(second.written).toEqual([])
    expect(await allKeys()).toEqual(keysAfterFirst)
    expect(await listStickerIds(store)).toHaveLength(seedFiles.length)
    expect((await listStickerIds(store)).sort()).toEqual(seedFiles.map(seedStickerId).sort())
  })

  it('dev: deletes uploads and restores deleted defaults', async () => {
    await seed(store, 'dev', directory)
    const upload = createUlid()
    await putSticker(store, upload, { sticker: Buffer.from('x'), thumbnail: Buffer.from('x') })
    const removedDefault = seedStickerId(seedFiles[0]!)
    await deleteKeys(store, [`stickers/${removedDefault}.webp`])

    const result = await seed(store, 'dev', directory)

    const ids = await listStickerIds(store)
    expect(ids).not.toContain(upload)
    expect(ids).toContain(removedDefault)
    expect(result.deleted).toEqual(expect.arrayContaining([`stickers/${upload}.webp`, `thumbs/${upload}.webp`]))
  })

  it('prod: seeds an empty bucket once, then leaves it alone', async () => {
    const first = await seed(store, 'prod', directory)
    expect(first.written).toHaveLength(seedFiles.length)

    const removedDefault = seedStickerId(seedFiles[0]!)
    await deleteKeys(store, [`stickers/${removedDefault}.webp`, `thumbs/${removedDefault}.webp`])
    const second = await seed(store, 'prod', directory)

    expect(second.skipped).toBe(true)
    expect(await listStickerIds(store)).not.toContain(removedDefault)
  })

  it('prod: skips when the marker exists even if every sticker was deleted', async () => {
    await store.client.send(new PutObjectCommand({ Bucket: store.bucket, Key: SEED_MARKER_KEY, Body: 'x' }))
    expect((await seed(store, 'prod', directory)).skipped).toBe(true)
    expect(await listStickerIds(store)).toEqual([])
  })
})
