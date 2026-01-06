/**
 * Package Generator
 * Generates shared library packages
 */

import path from 'path';
import { readdir } from 'fs/promises';
import { Generator } from './base/Generator.js';
import type {
  PackageOptions,
  GeneratorResult,
  ValidationResult,
} from '../types/generator.js';
import type { PackageTemplateContext } from '../types/templates.js';
import { packageOptionsSchema } from '../validators/schemas.js';
import { getCurrentYear, getCurrentDate, kebabCase } from '../utils/template-helpers.js';

export class PackageGenerator extends Generator<PackageOptions> {
  async generate(): Promise<GeneratorResult> {
    this.logger.info(`Generating ${this.options.type} package: ${this.options.name}`);

    try {
      // Validate options
      const validation = await this.validate();
      if (!validation.valid) {
        return this.createErrorResult(validation.errors.join('\n'));
      }

      // Create package directory
      const packagePath = this.getPackagePath();
      await this.ensureDirectory(packagePath);

      // Copy all template files
      await this.copyTemplateDirectory();

      this.logger.success(`Generated ${this.options.name} package`);

      return this.createSuccessResult(`Successfully generated ${this.options.name}`);
    } catch (error) {
      this.logger.error('Package generation failed', error as Error);
      return this.createErrorResult('Package generation failed', error as Error);
    }
  }

  async validate(): Promise<ValidationResult> {
    try {
      packageOptionsSchema.parse(this.options);

      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message],
      };
    }
  }

  getSchema() {
    return packageOptionsSchema;
  }

  private getPackagePath(): string {
    return this.options.outputPath || path.resolve(process.cwd(), 'packages', this.options.name);
  }

  private async copyTemplateDirectory(): Promise<void> {
    const templatePath = this.getTemplatePath('packages', this.options.type);
    const packagePath = this.getPackagePath();
    const context = this.getTemplateContext();

    await this.copyDirectoryRecursive(templatePath, packagePath, context);
  }

  private async copyDirectoryRecursive(
    sourcePath: string,
    destPath: string,
    context: PackageTemplateContext
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

  private getTemplateContext(): PackageTemplateContext {
    const { name, scope, type, includeBuild, includeTests } = this.options;

    return {
      projectName: kebabCase(name),
      projectScope: scope,
      scopeName: scope.replace('@', ''),
      projectType: 'minimal',
      bunVersion: '1.3.5',
      nodeVersion: '25.0.0',
      turboVersion: '2.6.1',
      typescriptVersion: '5.5.4',
      year: getCurrentYear(),
      date: getCurrentDate(),
      packageName: kebabCase(name),
      packageFullName: `${scope}/${kebabCase(name)}`,
      packageType: type,
      includeBuild: includeBuild ?? true,
      includeTests: includeTests ?? true,
    };
  }
}
