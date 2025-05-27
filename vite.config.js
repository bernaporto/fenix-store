import { defineConfig, configDefaults } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({ ignoreConfigErrors: true }),
    dts({ rollupTypes: true, exclude: ['**/*.test.ts', 'examples'] }),
  ],
  test: {
    include: ['./src/**/*.test.*'],
    exclude: [...configDefaults.exclude, './examples/**/*'],
    coverage: {
      include: ['src/**/*'],
      exclude: [
        'src/index.ts',
        '**/*.test.ts',
        '**/*.types.ts',
        '**/types.ts',
        'examples/**/*',
      ],
    },
  },
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
