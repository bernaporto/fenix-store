import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({ rollupTypes: true, exclude: ['**/*.test.ts'] }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: ['src/index.ts'],
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
      },
    },
  },
});
