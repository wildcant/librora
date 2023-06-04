import { defineConfig } from 'tsup'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  dts: true,
  entry: ['src/server/index.ts', 'src/client/index.ts'],
  format: ['cjs', 'esm'],
  minify: isProduction,
  sourcemap: true,
})
