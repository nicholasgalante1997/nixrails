/**
 * Package manager utilities
 * Provides Bun package manager operations
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { createLogger } from './logger.js';

const execAsync = promisify(exec);
const logger = createLogger('PackageManager');

/**
 * Install dependencies using Bun
 */
export async function installDependencies(
  projectPath: string,
  options: {
    frozenLockfile?: boolean;
    verbose?: boolean;
  } = {}
): Promise<void> {
  const { frozenLockfile = true, verbose = false } = options;

  logger.startSpinner('Installing dependencies...');

  try {
    const command = frozenLockfile ? 'bun install --frozen-lockfile' : 'bun install';

    const { stdout, stderr } = await execAsync(command, {
      cwd: projectPath,
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    if (verbose && stdout) {
      console.log(stdout);
    }

    if (stderr && verbose) {
      logger.debug(stderr);
    }

    logger.succeedSpinner('Dependencies installed successfully');
  } catch (error) {
    logger.failSpinner('Failed to install dependencies');
    throw new Error(`Failed to install dependencies: ${error}`);
  }
}

/**
 * Check if Bun is installed
 */
export async function isBunInstalled(): Promise<boolean> {
  try {
    await execAsync('bun --version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get Bun version
 */
export async function getBunVersion(): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync('bun --version');
    return stdout.trim();
  } catch {
    return undefined;
  }
}

/**
 * Link package globally
 */
export async function linkPackage(packagePath: string): Promise<void> {
  logger.info('Linking package globally...');

  try {
    await execAsync('bun link', { cwd: packagePath });
    logger.success('Package linked globally');
  } catch (error) {
    logger.error('Failed to link package', error as Error);
    throw error;
  }
}
