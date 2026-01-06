/**
 * App Generator
 * Generates application workspaces (web apps, scripts, etc.)
 */

import path from 'path';
import { readdir } from 'fs/promises';
import { Generator } from './base/Generator.js';
import type {
  AppOptions,
  GeneratorResult,
  ValidationResult,
} from '../types/generator.js';
import type { AppTemplateContext } from '../types/templates.js';
import { appOptionsSchema } from '../validators/schemas.js';
import { getCurrentYear, getCurrentDate, kebabCase, pascalCase } from '../utils/template-helpers.js';

export class AppGenerator extends Generator<AppOptions> {
  async generate(): Promise<GeneratorResult> {
    this.logger.info(`Generating ${this.options.type} app: ${this.options.name}`);

    try {
      // Validate options
      const validation = await this.validate();
      if (!validation.valid) {
        return this.createErrorResult(validation.errors.join('\n'));
      }

      // Create app directory
      const appPath = this.getAppPath();
      await this.ensureDirectory(appPath);

      // Copy all template files
      await this.copyTemplateDirectory();

      this.logger.success(`Generated ${this.options.name} app`);

      return this.createSuccessResult(`Successfully generated ${this.options.name}`);
    } catch (error) {
      this.logger.error('App generation failed', error as Error);
      return this.createErrorResult('App generation failed', error as Error);
    }
  }

  async validate(): Promise<ValidationResult> {
    try {
      appOptionsSchema.parse(this.options);

      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message],
      };
    }
  }

  getSchema() {
    return appOptionsSchema;
  }

  private getAppPath(): string {
    return this.options.outputPath || path.resolve(process.cwd(), 'apps', this.options.name);
  }

  private async copyTemplateDirectory(): Promise<void> {
    const templatePath = this.getTemplatePath('apps', this.options.type);
    const appPath = this.getAppPath();
    const context = this.getTemplateContext();

    await this.copyDirectoryRecursive(templatePath, appPath, context);
  }

  private async copyDirectoryRecursive(
    sourcePath: string,
    destPath: string,
    context: AppTemplateContext
  ): Promise<void> {
    const entries = await readdir(sourcePath, { withFileTypes: true });

    for (const entry of entries) {
      const sourceEntry = path.join(sourcePath, entry.name);
      const destEntry = path.join(destPath, entry.name);

      if (entry.isDirectory()) {
        await this.ensureDirectory(destEntry);
        await this.copyDirectoryRecursive(sourceEntry, destEntry, context);
      } else {
        // Check if it's a Handlebars template
        if (entry.name.endsWith('.hbs')) {
          const destFile = destEntry.replace(/\.hbs$/, '');
          await this.copyTemplate(sourceEntry, destFile, context);
        } else {
          // Copy non-template files as-is
          await this.copyFile(sourceEntry, destEntry);
        }
      }
    }
  }

  private getTemplateContext(): AppTemplateContext {
    const { name, scope, type } = this.options;

    return {
      projectName: kebabCase(name),
      projectNamePascal: pascalCase(name),
      projectScope: scope,
      scopeName: scope.replace('@', ''),
      projectType: 'minimal',
      bunVersion: '1.3.5',
      nodeVersion: '25.0.0',
      turboVersion: '2.6.1',
      typescriptVersion: '5.5.4',
      year: getCurrentYear(),
      date: getCurrentDate(),
      appName: kebabCase(name),
      appNamePascal: pascalCase(name),
      appType: type,
      port: 3000,
    };
  }
}
