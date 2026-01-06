/**
 * DockerGenerator
 * Generates Docker configuration files for the project
 */

import path from 'path';
import { mkdir } from 'fs/promises';
import { Generator } from './base/Generator.js';
import type { GeneratorOptions, GeneratorResult, ValidationResult } from '../types/generator.js';
import type { SupportedDatabase } from '../prompts/NewProjectPrompts.js';
import { z } from 'zod';

export interface DockerOptions extends GeneratorOptions {
  projectName: string;
  scope: string;
  databases?: SupportedDatabase[];
  includeWeb?: boolean;
  bunVersion: string;
}

export class DockerGenerator extends Generator<DockerOptions> {
  async generate(): Promise<GeneratorResult> {
    this.logger.info('Generating Docker configuration...');

    try {
      const projectPath = this.options.outputPath || process.cwd();
      const { databases = [], includeWeb = true } = this.options;

      // Create docker directory structure
      await this.createDockerDirectories(projectPath);

      // Copy Dockerfile for web
      if (includeWeb) {
        await this.copyDockerfile(projectPath);
      }

      // Copy docker-compose files
      await this.copyDockerComposeFiles(projectPath);

      // Copy database docker-compose if databases selected
      if (databases.length > 0) {
        await this.copyDatabaseCompose(projectPath);
      }

      // Copy .dockerignore
      await this.copyDockerIgnore(projectPath);

      this.logger.success('Docker configuration generated successfully');

      return this.createSuccessResult('Docker configuration generated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to generate Docker configuration: ${errorMessage}`);
      return this.createErrorResult(errorMessage);
    }
  }

  async validate(): Promise<ValidationResult> {
    const schema = this.getSchema();
    try {
      schema.parse(this.options);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        };
      }
      return {
        valid: false,
        errors: ['Validation failed'],
      };
    }
  }

  getSchema(): z.ZodSchema<DockerOptions> {
    return z.object({
      projectName: z.string().min(1),
      scope: z.string().min(1),
      databases: z.array(z.enum(['postgres', 'neo4j', 'sqlite3', 'mysql', 'edgedb'])).optional(),
      includeWeb: z.boolean().optional(),
      bunVersion: z.string().min(1),
      outputPath: z.string().min(1),
      dryRun: z.boolean().optional(),
      force: z.boolean().optional(),
      verbose: z.boolean().optional(),
    }) as z.ZodSchema<DockerOptions>;
  }

  /**
   * Create docker directory structure
   */
  private async createDockerDirectories(projectPath: string): Promise<void> {
    const dockerDir = path.join(projectPath, 'docker');
    const databaseDir = path.join(dockerDir, 'database');

    await mkdir(dockerDir, { recursive: true });
    await mkdir(databaseDir, { recursive: true });
  }

  /**
   * Copy Dockerfile.web
   */
  private async copyDockerfile(projectPath: string): Promise<void> {
    const templatePath = this.getTemplatePath('docker/Dockerfile.web.hbs');
    const destPath = path.join(projectPath, 'Dockerfile.web');

    await this.copyTemplate(templatePath, destPath, this.getTemplateContext());
  }

  /**
   * Copy main docker-compose files
   */
  private async copyDockerComposeFiles(projectPath: string): Promise<void> {
    const context = this.getTemplateContext();

    // Main docker-compose.yml
    const mainComposePath = this.getTemplatePath('docker/docker-compose.yml.hbs');
    const mainComposeDestPath = path.join(projectPath, 'docker-compose.yml');
    await this.copyTemplate(mainComposePath, mainComposeDestPath, context);

    // Web service docker-compose.web.yml
    const webComposePath = this.getTemplatePath('docker/docker-compose.web.yml.hbs');
    const webComposeDestPath = path.join(projectPath, 'docker-compose.web.yml');
    await this.copyTemplate(webComposePath, webComposeDestPath, context);
  }

  /**
   * Copy database docker-compose
   */
  private async copyDatabaseCompose(projectPath: string): Promise<void> {
    const templatePath = this.getTemplatePath('docker/database/docker-compose.yml.hbs');
    const destPath = path.join(projectPath, 'docker/database/docker-compose.yml');

    await this.copyTemplate(templatePath, destPath, this.getTemplateContext());
  }

  /**
   * Copy .dockerignore
   */
  private async copyDockerIgnore(projectPath: string): Promise<void> {
    const templatePath = this.getTemplatePath('docker/.dockerignore');
    const destPath = path.join(projectPath, '.dockerignore');

    await this.copyFile(templatePath, destPath);
  }

  /**
   * Get template context for rendering
   */
  private getTemplateContext(): Record<string, any> {
    const { projectName, scope, databases, bunVersion } = this.options;

    return {
      projectName,
      projectScope: scope,
      scopeName: scope.replace('@', ''),
      databases: databases || [],
      bunVersion,
    };
  }
}
