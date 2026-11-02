// Usage: node scripts/seed.ts --mode=dev|prod   (S3_* env vars select the bucket)
import { fileURLToPath } from 'node:url'
import { bucketFromEnv } from '../server/lib/s3.ts'
import { seed, type SeedMode } from '../server/lib/seed.ts'

const modeArg = process.argv.find(arg => arg.startsWith('--mode='))?.slice('--mode='.length)
if (modeArg !== 'dev' && modeArg !== 'prod') {
  console.error('Usage: node scripts/seed.ts --mode=dev|prod')
  process.exit(1)
}

const directory = fileURLToPath(new URL('../seed/stickers', import.meta.url))
const result = await seed(bucketFromEnv(), modeArg as SeedMode, directory)
if (result.skipped) {
  console.log('Seed marker exists, nothing to do (prod mode).')
} else {
  console.log(`Seeded (${modeArg}): ${result.written.length} written, ${result.unchanged.length} unchanged, ${result.deleted.length} stale objects deleted.`)
}
