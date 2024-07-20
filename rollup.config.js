import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  include: 'src/**',
  output: {
    file: 'index.cjs',
    format: 'cjs'
  },
  watch: {
    include: 'src/**'
  },
  plugins: [
    typescript(),
    resolve(),
  ]
};
