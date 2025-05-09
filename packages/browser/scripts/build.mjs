import { execSync } from 'child_process';
import * as esbuild from 'esbuild';

async function build() {
  console.log('[BoringMetrics] Building @boringmetrics/browser...');

  // Build CJS version
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'browser',
    format: 'cjs',
    outfile: 'dist/index.js',
    external: ['@boringmetrics/core'],
  });
  console.log('[BoringMetrics] CJS build complete ✅');

  // Build ESM version
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'browser',
    format: 'esm',
    outfile: 'dist/index.esm.js',
    external: ['@boringmetrics/core'],
  });
  console.log('[BoringMetrics] ESM build complete ✅');

  // Generate type declarations
  execSync('tsc --emitDeclarationOnly --declaration', { stdio: 'inherit' });
  console.log('[BoringMetrics] Type declarations complete ✅');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
