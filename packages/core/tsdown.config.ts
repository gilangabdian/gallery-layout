import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  platform: 'browser',
  clean: true,
  sourcemap: true,
  css: {
    inject: false,
  },
})
