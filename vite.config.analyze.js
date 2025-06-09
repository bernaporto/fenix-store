import { defineConfig } from 'vitest/config';
import { visualizer } from 'rollup-plugin-visualizer';

// Import the base config to extend it
import baseConfig from './vite.config.js';

export default defineConfig({
  ...baseConfig,
  plugins: [
    ...(baseConfig.plugins ?? []),

    // Add visualization plugins
    visualizer({
      filename: 'bundle-analysis/bundle-treemap.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
    visualizer({
      filename: 'bundle-analysis/bundle-sunburst.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'sunburst',
    }),
    visualizer({
      filename: 'bundle-analysis/bundle-network.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'network',
    }),
  ],
});
