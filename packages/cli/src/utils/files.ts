/**
 * File system utilities
 * Provides safe file operations with dry-run support
 */

import { mkdir, writeFile, readFile, stat, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { createLogger } from './logger.js';

const logger = createLogger('FileSystem');

export class FileSystemManager {
  private dryRun: boolean;
  private generatedFiles: string[] = [];
  private verbose: boolean;

  constructor(dryRun = false, verbose = false) {
    this.dryRun = dryRun;
    this.verbose = verbose;
  }

  /**
   * Ensure a directory exists, creating it if necessary
   */
  async ensureDirectory(dirPath: string): Promise<void> {
    if (this.dryRun) {
      logger.debug(`[DRY RUN] Would create directory: ${dirPath}`);
      return;
    }

    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
      if (this.verbose) {
        logger.debug(`Created directory: ${dirPath}`);
      }
    }
  }

  /**
   * Write content to a file
   */
  async writeFile(
    filePath: string,
    content: string,
    options: { overwrite?: boolean } = {}
  ): Promise<void> {
    if (this.dryRun) {
      logger.debug(`[DRY RUN] Would write file: ${filePath}`);
      return;
    }

    const fileExists = existsSync(filePath);
    if (fileExists && !options.overwrite) {
      throw new Error(`File already exists: ${filePath}. Use --force to overwrite.`);
    }

    // Ensure parent directory exists
    const dir = path.dirname(filePath);
    await this.ensureDirectory(dir);

    await writeFile(filePath, content, 'utf-8');
    this.generatedFiles.push(filePath);

    if (this.verbose) {
      logger.debug(`${fileExists ? 'Updated' : 'Created'} file: ${filePath}`);
    }
  }

  /**
   * Read file content
   */
  async readFile(filePath: string): Promise<string> {
    return await readFile(filePath, 'utf-8');
  }

  /**
   * Check if file or directory exists
   */
  exists(filePath: string): boolean {
    return existsSync(filePath);
  }

  /**
   * Check if path is a directory
   */
  async isDirectory(dirPath: string): Promise<boolean> {
    try {
      const stats = await stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Copy a file
   */
  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    if (this.dryRun) {
      logger.debug(`[DRY RUN] Would copy file: ${sourcePath} -> ${destPath}`);
      return;
    }

    const dir = path.dirname(destPath);
    await this.ensureDirectory(dir);

    await copyFile(sourcePath, destPath);
    this.generatedFiles.push(destPath);

    if (this.verbose) {
      logger.debug(`Copied file: ${sourcePath} -> ${destPath}`);
    }
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return [...this.generatedFiles];
  }

  /**
   * Clear generated files list
   */
  clearGeneratedFiles(): void {
    this.generatedFiles = [];
  }

  /**
   * Get file stats
   */
  async getStats(filePath: string) {
    return await stat(filePath);
  }
}
