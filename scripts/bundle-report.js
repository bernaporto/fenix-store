#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSize } from 'gzip-size';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Analyze bundle sizes for Fenix Store
 */
async function analyzeBundles() {
  console.log('📦 Fenix Store Bundle Analysis\n');

  const distPath = path.join(__dirname, '..', 'dist');

  if (!fs.existsSync(distPath)) {
    console.error('❌ No dist folder found. Run `pnpm build:analyze` first.');
    process.exit(1);
  }

  const results = await processFiles(distPath);

  if (results.length === 0) {
    console.error('❌ No bundle files found in dist folder.');
    process.exit(1);
  }

  generateReport(results);
  await generateSizeRecommendations(results);
  saveReport(results);
}

async function processFiles(distPath) {
  const files = fs
    .readdirSync(distPath)
    .filter((f) => f.endsWith('.cjs') || f.endsWith('.mjs'));
  const results = [];

  for (const file of files) {
    const filePath = path.join(distPath, file);
    const content = fs.readFileSync(filePath);

    const rawSize = content.length;
    const gzipped = await gzipSize(content);
    const brotli = await gzipSize(content, { level: 9 }); // Max level is 9

    results.push({
      file,
      format: getFormatFromFilename(file),
      rawSize: formatBytes(rawSize),
      gzipSize: formatBytes(gzipped),
      brotliSize: formatBytes(brotli),
      rawBytes: rawSize,
      gzipBytes: gzipped,
      brotliBytes: brotli,
    });
  }

  // Sort by format priority and then by size
  return results.sort((a, b) => {
    const formatPriority = { ESM: 1, CJS: 2, UMD: 3 };
    const aPriority = formatPriority[a.format] || 99;
    const bPriority = formatPriority[b.format] || 99;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return a.rawBytes - b.rawBytes;
  });
}

function getFormatFromFilename(filename) {
  if (filename.endsWith('.mjs')) return 'ESM';
  if (filename.endsWith('.cjs')) return 'CJS';
  if (filename.includes('.umd.')) return 'UMD';
  return 'Unknown';
}

function generateReport(results) {
  console.log(
    '┌─────────────────────────────┬────────────┬─────────────┬─────────────┬─────────────┐',
  );
  console.log(
    '│ File                        │ Format     │ Raw         │ Gzip        │ Brotli      │',
  );
  console.log(
    '├─────────────────────────────┼────────────┼─────────────┼─────────────┼─────────────┤',
  );

  results.forEach(({ file, format, rawSize, gzipSize, brotliSize }) => {
    const shortFile = file.length > 23 ? file.substring(0, 20) + '...' : file;
    console.log(
      `│ ${shortFile.padEnd(27)} │ ${format.padEnd(10)} │ ${rawSize.padStart(11)} │ ${gzipSize.padStart(11)} │ ${brotliSize.padStart(11)} │`,
    );
  });

  console.log(
    '└─────────────────────────────┴────────────┴─────────────┴─────────────┴─────────────┘',
  );
}

async function generateSizeRecommendations(results) {
  console.log('\n📊 Bundle Analysis Summary\n');

  const esmBundle = results.find((r) => r.format === 'ESM');
  const cjsBundle = results.find((r) => r.format === 'CJS');
  const umdBundle = results.find((r) => r.format === 'UMD');

  if (esmBundle) {
    console.log(`🌳 ESM (Modern bundlers): ${esmBundle.gzipSize} gzipped`);
    console.log('   ✅ Tree-shaking supported');
    console.log('   📝 Recommended for: Vite, Webpack 5+, Rollup');
  }

  if (cjsBundle) {
    console.log(`📦 CommonJS (Node.js): ${cjsBundle.gzipSize} gzipped`);
    console.log('   📝 Recommended for: Node.js applications');
  }

  if (umdBundle) {
    console.log(`🌐 UMD (Universal): ${umdBundle.gzipSize} gzipped`);
    console.log('   📝 Recommended for: Browser <script> tags, older bundlers');
  }

  // Size categories
  const smallestGzip = Math.min(...results.map((r) => r.gzipBytes));
  console.log(`\n💾 Smallest bundle: ${formatBytes(smallestGzip)} (gzipped)`);

  if (smallestGzip < 3000) {
    console.log('✅ Excellent size - under 3KB gzipped');
  } else if (smallestGzip < 5000) {
    console.log('✅ Good size - under 5KB gzipped');
  } else if (smallestGzip < 10000) {
    console.log('⚠️  Moderate size - consider optimization');
  } else {
    console.log('🔍 Large size - optimization recommended');
  }

  // Check for TypeScript definitions
  const distPath = path.join(__dirname, '..', 'dist');
  const hasTypes = fs.existsSync(path.join(distPath, 'index.d.ts'));
  console.log(
    `\n📝 TypeScript definitions: ${hasTypes ? '✅ Available' : '❌ Missing'}`,
  );

  // Check for source maps
  const hasSourceMaps = results.some((r) =>
    fs.existsSync(path.join(distPath, r.file + '.map')),
  );
  console.log(
    `🗺️  Source maps: ${hasSourceMaps ? '✅ Available' : '❌ Missing'}`,
  );
}

function saveReport(results) {
  const reportDir = path.join(__dirname, '..', 'bundle-analysis');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // Enhanced report structure
  const report = {
    timestamp: new Date().toISOString(),
    buildTool: 'Vite',
    library: 'Fenix Store',
    bundles: results,
    summary: {
      totalBundles: results.length,
      smallestGzipped: Math.min(...results.map((r) => r.gzipBytes)),
      largestGzipped: Math.max(...results.map((r) => r.gzipBytes)),
      formats: [...new Set(results.map((r) => r.format))],
      recommendedBundle:
        results.find((r) => r.format === 'ESM')?.file || results[0]?.file,
    },
  };

  // Save detailed report
  fs.writeFileSync(
    path.join(reportDir, 'size-report.json'),
    JSON.stringify(report, null, 2),
  );

  // Create CI-friendly bundle report
  const ciReport = {
    esm: results.find((r) => r.format === 'ESM')
      ? {
          raw: results.find((r) => r.format === 'ESM').rawSize,
          gzipped: results.find((r) => r.format === 'ESM').gzipSize,
          rawBytes: results.find((r) => r.format === 'ESM').rawBytes,
          gzipBytes: results.find((r) => r.format === 'ESM').gzipBytes,
        }
      : null,
    cjs: results.find((r) => r.format === 'CJS')
      ? {
          raw: results.find((r) => r.format === 'CJS').rawSize,
          gzipped: results.find((r) => r.format === 'CJS').gzipSize,
          rawBytes: results.find((r) => r.format === 'CJS').rawBytes,
          gzipBytes: results.find((r) => r.format === 'CJS').gzipBytes,
        }
      : null,
    treeshaking: results.some((r) => r.format === 'ESM'),
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA?.substring(0, 7) || 'local',
  };

  fs.writeFileSync(
    path.join(reportDir, 'bundle-report.json'),
    JSON.stringify(ciReport, null, 2),
  );

  console.log(`\n📄 Detailed report: bundle-analysis/size-report.json`);
  console.log(`🤖 CI report: bundle-analysis/bundle-report.json`);

  const visualizations = [
    'bundle-treemap.html',
    'bundle-sunburst.html',
    'bundle-network.html',
  ].filter((file) => fs.existsSync(path.join(reportDir, file)));

  if (visualizations.length > 0) {
    console.log('📊 Visual analysis:');
    visualizations.forEach((file) => {
      console.log(`   • bundle-analysis/${file}`);
    });
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n\n⏸️  Bundle analysis interrupted');
  process.exit(0);
});

analyzeBundles().catch((error) => {
  console.error('\n❌ Bundle analysis failed:', error.message);
  process.exit(1);
});
