/**
 * Base generator class
 * Abstract base class for all generators
 */

import type { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  GeneratorOptions,
  GeneratorResult,
  ValidationResult,
  IGenerator,
} from '../../types/generator.js';
import { FileSystemManager } from '../../utils/files.js';
import { TemplateRenderer } from './TemplateRenderer.js';
import { createLogger, type Logger } from '../../utils/logger.js';

export abstract class Generator<T extends GeneratorOptions = GeneratorOptions>
  implements IGenerator<T>
{
  protected options: T;
  protected logger: Logger;
  protected fsManager: FileSystemManager;
  protected renderer: TemplateRenderer;
  protected generatedFiles: string[] = [];

  constructor(options: T) {
    this.options = options;
    this.logger = createLogger(this.constructor.name, options.verbose);
    this.fsManager = new FileSystemManager(options.dryRun, options.verbose);
    this.renderer = new TemplateRenderer();
  }

  /**
   * Generate files based on options
   * Must be implemented by subclasses
   */
  abstract generate(): Promise<GeneratorResult>;

  /**
   * Validate options before generation
   * Must be implemented by subclasses
   */
  abstract validate(): Promise<ValidationResult>;

  /**
   * Get the Zod schema for options validation
   * Must be implemented by subclasses
   */
  abstract getSchema(): z.ZodSchema<T>;

  /**
   * Get the templates directory path
   */
  protected getTemplatesDir(): string {
    // Get the directory of this source file using fileURLToPath
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDir = path.dirname(currentFilePath);
    // Templates are at packages/cli/templates (two levels up from src/generators/base)
    return path.resolve(currentDir, '../../../templates');
  }

  /**
   * Get the full template path
   */
  protected getTemplatePath(...segments: string[]): string {
    return path.join(this.getTemplatesDir(), ...segments);
  }

  /**
   * Ensure a directory exists
   */
  protected async ensureDirectory(dirPath: string): Promise<void> {
    await this.fsManager.ensureDirectory(dirPath);
  }

  /**
   * Write a file
   */
  protected async writeFile(
    filePath: string,
    content: string,
    options?: { overwrite?: boolean }
  ): Promise<void> {
    await this.fsManager.writeFile(filePath, content, options);
    this.generatedFiles.push(filePath);
  }

  /**
   * Copy a template file and render it
   */
  protected async copyTemplate(
    templatePath: string,
    destinationPath: string,
    context: Record<string, any>
  ): Promise<void> {
    const rendered = await this.renderer.renderFile(templatePath, context);
    await this.writeFile(destinationPath, rendered, { overwrite: this.options.force });
  }

  /**
   * Copy a template file without rendering
   */
  protected async copyFile(sourcePath: string, destPath: string): Promise<void> {
    await this.fsManager.copyFile(sourcePath, destPath);
    this.generatedFiles.push(destPath);
  }

  /**
   * Check if a path exists
   */
  protected exists(filePath: string): boolean {
    return this.fsManager.exists(filePath);
  }

  /**
   * Get all generated file paths
   */
  protected getGeneratedFiles(): string[] {
    return [...this.generatedFiles, ...this.fsManager.getGeneratedFiles()];
  }

  /**
   * Create a success result
   */
  protected createSuccessResult(message: string): GeneratorResult {
    return {
      success: true,
      files: this.getGeneratedFiles(),
      message,
    };
  }

  /**
   * Create an error result
   */
  protected createErrorResult(message: string, error?: Error): GeneratorResult {
    return {
      success: false,
      files: this.getGeneratedFiles(),
      message,
      error,
    };
  }
}
