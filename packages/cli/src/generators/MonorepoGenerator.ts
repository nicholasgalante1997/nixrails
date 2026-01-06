/**
 * Monorepo Generator
 * Generates a complete Bun Turborepo workspace
 */

import path from 'path';
import { Generator } from './base/Generator.js';
import { AppGenerator } from './AppGenerator.js';
import { PackageGenerator } from './PackageGenerator.js';
import type {
  MonorepoOptions,
  GeneratorResult,
  ValidationResult,
} from '../types/generator.js';
import type { TemplateContext } from '../types/templates.js';
import { monorepoOptionsSchema } from '../validators/schemas.js';
import { initGitRepository, createInitialCommit, getGitUserName, getGitUserEmail } from '../utils/git.js';
import { installDependencies } from '../utils/package-manager.js';
import { getCurrentYear, getCurrentDate, kebabCase, pascalCase } from '../utils/template-helpers.js';

export class MonorepoGenerator extends Generator<MonorepoOptions> {
  async generate(): Promise<GeneratorResult> {
    this.logger.info(`Generating ${this.options.type} monorepo: ${this.options.name}`);

    try {
      // Validate options
      const validation = await this.validate();
      if (!validation.valid) {
        return this.createErrorResult(validation.errors.join('\n'));
      }

      // Create base directory structure
      await this.createBaseStructure();

      // Generate root configuration files
      await this.generateRootConfigs();

      // Generate packages based on type
      await this.generatePackages();

      // Generate apps based on type
      await this.generateApps();

      // Initialize git repository
      if (!this.options.skipGit) {
        await this.initializeGit();
      }

      // Install dependencies
      if (!this.options.skipInstall) {
        await this.installDependencies();
      }

      // Display next steps
      this.displayNextSteps();

      return this.createSuccessResult(`Successfully generated ${this.options.name}`);
    } catch (error) {
      this.logger.error('Generation failed', error as Error);
      return this.createErrorResult('Generation failed', error as Error);
    }
  }

  async validate(): Promise<ValidationResult> {
    try {
      monorepoOptionsSchema.parse(this.options);

      // Check if directory already exists
      const projectPath = this.getProjectPath();
      if (this.exists(projectPath) && !this.options.force) {
        return {
          valid: false,
          errors: [`Directory already exists: ${projectPath}. Use --force to overwrite.`],
        };
      }

      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message],
      };
    }
  }

  getSchema() {
    return monorepoOptionsSchema;
  }

  private getProjectPath(): string {
    return path.resolve(process.cwd(), this.options.name);
  }

  private async createBaseStructure(): Promise<void> {
    const projectPath = this.getProjectPath();

    this.logger.info('Creating directory structure...');

    await this.ensureDirectory(projectPath);
    await this.ensureDirectory(path.join(projectPath, 'apps'));
    await this.ensureDirectory(path.join(projectPath, 'packages'));
  }

  private async generateRootConfigs(): Promise<void> {
    const projectPath = this.getProjectPath();
    const context = await this.getTemplateContext();

    this.logger.info('Generating root configuration files...');

    // Generate package.json
    await this.copyTemplate(
      this.getTemplatePath('base/root/package.json.hbs'),
      path.join(projectPath, 'package.json'),
      context
    );

    // Generate turbo.json
    await this.copyTemplate(
      this.getTemplatePath('base/root/turbo.json.hbs'),
      path.join(projectPath, 'turbo.json'),
      context
    );

    // Generate .mise.toml
    await this.copyTemplate(
      this.getTemplatePath('base/root/.mise.toml.hbs'),
      path.join(projectPath, '.mise.toml'),
      context
    );

    // Generate .gitignore
    await this.copyTemplate(
      this.getTemplatePath('base/root/.gitignore.hbs'),
      path.join(projectPath, '.gitignore'),
      context
    );

    // Generate .env.example
    await this.copyTemplate(
      this.getTemplatePath('base/root/.env.example.hbs'),
      path.join(projectPath, '.env.example'),
      context
    );

    // Generate README.md
    await this.copyTemplate(
      this.getTemplatePath('base/root/README.md.hbs'),
      path.join(projectPath, 'README.md'),
      context
    );

    this.logger.success('Root configuration files generated');
  }

  private async generatePackages(): Promise<void> {
    this.logger.info('Generating packages...');

    const packagesToGenerate = this.getPackagesToGenerate();

    for (const pkg of packagesToGenerate) {
      const generator = new PackageGenerator({
        ...pkg,
        outputPath: path.join(this.getProjectPath(), 'packages', pkg.name),
        dryRun: this.options.dryRun,
        force: this.options.force,
        verbose: this.options.verbose,
      });

      await generator.generate();
    }

    this.logger.success(`Generated ${packagesToGenerate.length} packages`);
  }

  private getPackagesToGenerate() {
    const { type, scope } = this.options;
    const packages = [];

    // Always include @configs
    packages.push({ name: 'configs', type: 'configs' as const, scope });

    // Always include @types
    packages.push({ name: 'types', type: 'types' as const, scope });

    // Always include @utils
    packages.push({ name: 'utils', type: 'utils' as const, scope, includeBuild: true, includeTests: true });

    // Always include @logger
    packages.push({ name: 'logger', type: 'logger' as const, scope, includeBuild: true });

    // Add @database for full-stack
    if (type === 'full-stack') {
      packages.push({ name: 'database', type: 'database' as const, scope, includeBuild: true });
    }

    return packages;
  }

  private async generateApps(): Promise<void> {
    this.logger.info('Generating apps...');

    const appsToGenerate = this.getAppsToGenerate();

    for (const app of appsToGenerate) {
      const generator = new AppGenerator({
        ...app,
        outputPath: path.join(this.getProjectPath(), 'apps', app.name),
        dryRun: this.options.dryRun,
        force: this.options.force,
        verbose: this.options.verbose,
      });

      await generator.generate();
    }

    this.logger.success(`Generated ${appsToGenerate.length} apps`);
  }

  private getAppsToGenerate() {
    const { scope } = this.options;
    const apps = [];

    // Always include web app
    apps.push({ name: 'web', type: 'web-react-ssr' as const, scope });

    return apps;
  }

  private async initializeGit(): Promise<void> {
    const projectPath = this.getProjectPath();

    if (this.options.dryRun) {
      this.logger.info('[DRY RUN] Would initialize git repository');
      return;
    }

    await initGitRepository(projectPath);
    await createInitialCommit(projectPath);
  }

  private async installDependencies(): Promise<void> {
    const projectPath = this.getProjectPath();

    if (this.options.dryRun) {
      this.logger.info('[DRY RUN] Would install dependencies');
      return;
    }

    await installDependencies(projectPath, {
      frozenLockfile: false, // First install doesn't have lockfile yet
      verbose: this.options.verbose,
    });
  }

  private async getTemplateContext(): Promise<TemplateContext> {
    const { name, scope, bunVersion, nodeVersion } = this.options;

    return {
      projectName: kebabCase(name),
      projectNamePascal: pascalCase(name),
      projectScope: scope,
      scopeName: scope.replace('@', ''),
      projectType: this.options.type,
      bunVersion,
      nodeVersion,
      turboVersion: '2.6.1',
      typescriptVersion: '5.5.4',
      year: getCurrentYear(),
      date: getCurrentDate(),
      author: await getGitUserName(),
      email: await getGitUserEmail(),
      databases: this.options.databases,
    } as TemplateContext;
  }

  private displayNextSteps(): void {
    const { name } = this.options;

    console.log('\n');
    console.log('✅ Project created successfully!');
    console.log('\n');
    console.log('Next steps:');
    console.log(`  1. cd ${name}`);
    console.log('  2. mise run dev');
    console.log('  3. Open http://localhost:3000');
    console.log('\n');
    console.log('Available commands:');
    console.log('  mise run dev       # Start development');
    console.log('  mise run build     # Build for production');
    console.log('  mise run test      # Run tests');
    console.log('  mise run lint      # Lint code');
    console.log('  mise run clean     # Clean build artifacts');
    console.log('\n');
  }
}
