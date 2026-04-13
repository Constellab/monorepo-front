/**
 * Esbuild configuration file to build the reflex component library into a single bundle.
 * It is called after the angular build process completes.
 * Usage:
 *   node esbuild.reflex-lib.mjs [--prod]
 *
 * The --prod flag enables minification for production builds.
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const isProd = process.argv.includes('--prod');
const outDir = 'dist/apps/dc-dashboard-components/reflex-components/gws_plugin';

await esbuild.build({
  stdin: {
    // Import polyfills first (zone.js, reflect-metadata), then re-export from main.js
    contents: `import './polyfills.js';\nexport * from './main.js';`,
    resolveDir: outDir,
  },
  bundle: true,
  outfile: `${outDir}/dc-reflex.js`,
  format: 'esm',
  minify: isProd,
  sourcemap: !isProd,
  target: ['es2020'],
  platform: 'browser',
});

// Clean up files that are now bundled into dc-reflex.js
const filesToDelete = fs
  .readdirSync(outDir)
  .filter((f) => f === 'main.js' || f === 'polyfills.js' || f.startsWith('chunk-'))
  .map((f) => path.join(outDir, f));

filesToDelete.forEach((f) => fs.unlinkSync(f));

console.log(`Built dc-reflex.js (${isProd ? 'production' : 'development'})`);
console.log(`Cleaned up ${filesToDelete.length} bundled files`);
