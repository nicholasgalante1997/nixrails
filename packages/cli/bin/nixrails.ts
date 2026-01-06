#!/usr/bin/env bun

/**
 * NixRails CLI entry point
 * Executable entry for the scaffolding engine
 */

import { program } from '../src/cli.js';

// Run the CLI
program.parse(process.argv);
