/**
 * NixRails CLI
 * Main command-line interface orchestrator
 */

import { Command } from 'commander';
import { newCommand } from './commands/new.js';

export const program = new Command();

program
  .name('nixrails')
  .description('Scaffolding engine for Bun Turborepo workspaces')
  .version('0.1.0');

// Register commands
program.addCommand(newCommand);

// Show help if no command provided
if (process.argv.length === 2) {
  program.help();
}
