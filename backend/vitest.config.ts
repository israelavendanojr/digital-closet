import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.test.ts'],
    hookTimeout: 300000, // allow time for first-time MongoDB binary download
    pool: 'forks',
    maxForks: 1, // serialize files to avoid parallel binary downloads
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/test/**', 'src/index.ts', 'src/data/**'],
    },
  },
})
