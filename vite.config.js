import { defineConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({ ignoreConfigErrors: true, }),
    dts({ rollupTypes: true, exclude: ['**/*.test.ts', 'examples'] }),
  ],
  build: {
    sourcemap: true,
    test: {
      include: ['./src/**/*.test.*'],
      exclude: [
        ...configDefaults.exclude,
        './examples/*'
      ],
    },
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
