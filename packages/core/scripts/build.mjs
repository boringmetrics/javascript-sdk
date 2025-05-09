import { execSync } from 'child_process';
import * as esbuild from 'esbuild';

async function build() {
  console.log('[BoringMetrics] Building @boringmetrics/core...');

  // Build CJS version
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'neutral',
    format: 'cjs',
    outfile: 'dist/index.js',
  });
  console.log('[BoringMetrics] CJS build complete ✅');

  // Build ESM version
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'neutral',
    format: 'esm',
    outfile: 'dist/index.esm.js',
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
