#!/usr/bin/env bun

export {};

/**
 * Build script for @nixrails/cli package
 * Bundles the CLI tool using Bun's build API
 */

const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'bun',
  format: 'esm',
  splitting: false,
  sourcemap: 'linked',
  minify: false,
  external: [
    'commander',
    'handlebars',
    'chalk',
    'ora',
    'inquirer',
    'zod'
  ]
});

if (!result.success) {
  console.error('Build failed:');
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

console.log('✓ Build completed successfully');
console.log(`  ${result.outputs.length} file(s) generated`);
