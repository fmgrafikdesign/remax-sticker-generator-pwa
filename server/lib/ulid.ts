import { randomBytes } from 'node:crypto'

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/**
 * Encodes a ULID from a millisecond timestamp and 10 bytes of randomness.
 * Pass fixed inputs to get a deterministic id (used for seeded stickers).
 */
export function createUlid(time: number = Date.now(), random: Uint8Array = randomBytes(10)): string {
  if (random.length < 10) throw new Error('ULID randomness needs 10 bytes')
  let timePart = ''
  let t = time
  for (let i = 0; i < 10; i++) {
    timePart = ALPHABET[t % 32] + timePart
    t = Math.floor(t / 32)
  }
  // 80 bits -> 16 base32 chars, 5 bits at a time
  let bits = 0n
  for (let i = 0; i < 10; i++) bits = (bits << 8n) | BigInt(random[i]!)
  let randomPart = ''
  for (let i = 0; i < 16; i++) {
    randomPart = ALPHABET[Number(bits & 31n)] + randomPart
    bits >>= 5n
  }
  return timePart + randomPart
}
