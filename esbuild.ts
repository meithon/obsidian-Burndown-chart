import * as esbuild from 'esbuild'

const context = await esbuild.context({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'index.cjs',
})
await context.watch()
