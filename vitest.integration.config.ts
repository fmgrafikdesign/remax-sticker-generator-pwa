import { defineConfig } from 'vitest/config'

// Runs against a real S3 bucket (S3_* env vars), e.g. the docker compose MinIO.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/*.test.ts'],
    testTimeout: 60_000,
    fileParallelism: false
  }
})
