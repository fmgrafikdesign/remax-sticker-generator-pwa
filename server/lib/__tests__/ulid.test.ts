import { describe, expect, it } from 'vitest'
import { STICKER_ID_PATTERN } from '../../../shared/stickers'
import { createUlid } from '../ulid'
import { seedStickerId } from '../seed'

describe('createUlid', () => {
  it('produces valid sticker ids', () => {
    expect(createUlid()).toMatch(STICKER_ID_PATTERN)
  })

  it('sorts lexicographically by time, so newest-first is a reversed key sort', () => {
    const random = new Uint8Array(10).fill(255)
    const older = createUlid(Date.UTC(2024, 0, 1), random)
    const newer = createUlid(Date.UTC(2024, 0, 1) + 1, new Uint8Array(10))
    expect(older < newer).toBe(true)
  })

  it('encodes the time like the ULID spec', () => {
    // reference value from the spec's example timestamp 1469918176385 -> "01ARYZ6S41"
    expect(createUlid(1469918176385, new Uint8Array(10)).slice(0, 10)).toBe('01ARYZ6S41')
  })
})

describe('seedStickerId', () => {
  it('is stable per file name and differs between files', () => {
    expect(seedStickerId('balloon.png')).toBe(seedStickerId('balloon.png'))
    expect(seedStickerId('balloon.png')).not.toBe(seedStickerId('sold.png'))
    expect(seedStickerId('balloon.png')).toMatch(STICKER_ID_PATTERN)
  })

  it('sorts seeded stickers before anything uploaded later', () => {
    expect(seedStickerId('zzz.png') < createUlid()).toBe(true)
  })
})
