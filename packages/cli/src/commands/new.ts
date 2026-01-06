/**
 * New command
 * Creates a new NixRails project
 */

import { Command } from 'commander';
import { MonorepoGenerator } from '../generators/MonorepoGenerator.js';
import { promptNewProject, type SupportedDatabase } from '../prompts/NewProjectPrompts.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('new');

interface NewCommandOptions {
  type?: 'minimal' | 'full-stack';
  scope?: string;
  bun?: string;
  node?: string;
  docker?: boolean;
  databases?: string;
  ci?: 'github' | 'gitlab';
  force?: boolean;
  dryRun?: boolean;
  skipInstall?: boolean;
  skipGit?: boolean;
  verbose?: boolean;
}

export const newCommand = new Command('new')
  .description('Create a new NixRails project')
  .argument('[name]', 'Project name')
  .option('-t, --type <type>', 'Project type (minimal, full-stack)', 'minimal')
  .option('-s, --scope <scope>', 'NPM scope (e.g., @myapp)')
  .option('--bun <version>', 'Bun version', '1.3.5')
  .option('--node <version>', 'Node.js version', '25.0.0')
  .option('--docker', 'Include Docker configuration')
  .option('--databases <databases>', 'Comma-separated list of databases (postgres,neo4j,sqlite3)')
  .option('--ci <provider>', 'Include CI/CD configuration (github, gitlab)')
  .option('-f, --force', 'Overwrite existing directory')
  .option('--dry-run', 'Show what would be generated without creating files')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .option('-v, --verbose', 'Verbose output')
  .action(async (name: string | undefined, options: NewCommandOptions) => {
    try {
      let projectOptions;

      // If no name provided or not enough options, show interactive prompts
      if (!name) {
        projectOptions = await promptNewProject();
      } else {
        // Parse databases from comma-separated string
        const databases = options.databases
          ? options.databases.split(',').map(db => db.trim() as SupportedDatabase)
          : undefined;

        // Use CLI options
        projectOptions = {
          name,
          scope: options.scope || `@${name}`,
          type: options.type || 'minimal',
          bunVersion: options.bun || '1.3.5',
          nodeVersion: options.node || '25.0.0',
          includeDocker: options.docker || false,
          includeCI: !!options.ci,
          ciProvider: options.ci,
          databases,
        };
      }

      // Create generator with all options
      const generator = new MonorepoGenerator({
        ...projectOptions,
        force: options.force,
        dryRun: options.dryRun,
        skipInstall: options.skipInstall,
        skipGit: options.skipGit,
        verbose: options.verbose,
      } as any);

      // Generate the project
      const result = await generator.generate();

      if (!result.success) {
        logger.error(result.message, result.error);
        process.exit(1);
      }
    } catch (error) {
      logger.error('Failed to create project', error as Error);
      process.exit(1);
    }
  });
