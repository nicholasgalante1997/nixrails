/**
 * Git utilities
 * Provides git operations for project initialization
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { createLogger } from './logger.js';

const execAsync = promisify(exec);
const logger = createLogger('Git');

/**
 * Execute a git command
 */
async function runGitCommand(command: string, cwd: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    if (stderr) {
      logger.debug(stderr);
    }
    return stdout.trim();
  } catch (error) {
    throw new Error(`Git command failed: ${command}\n${error}`);
  }
}

/**
 * Initialize a git repository
 */
export async function initGitRepository(projectPath: string): Promise<void> {
  logger.info('Initializing git repository...');

  try {
    await runGitCommand('git init', projectPath);
    logger.success('Git repository initialized');
  } catch (error) {
    logger.error('Failed to initialize git repository', error as Error);
    throw error;
  }
}

/**
 * Create initial commit
 */
export async function createInitialCommit(projectPath: string): Promise<void> {
  logger.info('Creating initial commit...');

  try {
    await runGitCommand('git add .', projectPath);
    await runGitCommand('git commit -m "chore: initial commit from nixrails"', projectPath);
    logger.success('Initial commit created');
  } catch (error) {
    logger.error('Failed to create initial commit', error as Error);
    throw error;
  }
}

/**
 * Get git user name
 */
export async function getGitUserName(): Promise<string | undefined> {
  try {
    return await execAsync('git config --get user.name')
      .then(({ stdout }) => stdout.trim())
      .catch(() => undefined);
  } catch {
    return undefined;
  }
}

/**
 * Get git user email
 */
export async function getGitUserEmail(): Promise<string | undefined> {
  try {
    return await execAsync('git config --get user.email')
      .then(({ stdout }) => stdout.trim())
      .catch(() => undefined);
  } catch {
    return undefined;
  }
}

/**
 * Check if git is installed
 */
export async function isGitInstalled(): Promise<boolean> {
  try {
    await execAsync('git --version');
    return true;
  } catch {
    return false;
  }
}
