// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/index.es.js',
        format: 'es'
      },
    ],
    plugins: [
      typescript(),
      nodeResolve({
        preferBuiltins: true  
      })
    ]
  },
];