import { createHash, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const digest = (value: string) => createHash('sha256').update(value).digest()

/** Throws 401 unless the request carries one of the comma-separated ADMIN_TOKENS as bearer token. */
export function requireAdmin(event: H3Event) {
  const tokens = (process.env.ADMIN_TOKENS ?? '').split(',').map(token => token.trim()).filter(Boolean)
  const header = getRequestHeader(event, 'authorization') ?? ''
  const given = header.startsWith('Bearer ') ? digest(header.slice('Bearer '.length).trim()) : null
  // compare digests: equal length, constant time
  if (!given || !tokens.some(token => timingSafeEqual(digest(token), given))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
