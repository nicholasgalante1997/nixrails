/**
 * Generator type definitions
 * Core interfaces and types for the generator system
 */

import { SupportedDatabase } from '@/prompts/NewProjectPrompts';
import type { z } from 'zod';

/**
 * Base options for all generators
 */
export interface GeneratorOptions {
  /** Output directory path */
  outputPath?: string;
  /** Dry run mode - don't actually write files */
  dryRun?: boolean;
  /** Force overwrite existing files */
  force?: boolean;
  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Result of a generator operation
 */
export interface GeneratorResult {
  /** Whether the generation was successful */
  success: boolean;
  /** List of generated file paths */
  files: string[];
  /** Success or error message */
  message: string;
  /** Optional error details */
  error?: Error;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** List of validation errors */
  errors: string[];
}

/**
 * File generation operation
 */
export interface FileOperation {
  /** Type of operation */
  type: 'create' | 'update' | 'delete';
  /** Source file path (for templates) */
  sourcePath?: string;
  /** Destination file path */
  destinationPath: string;
  /** File content */
  content?: string;
}

/**
 * Abstract generator interface
 */
export interface IGenerator<T extends GeneratorOptions = GeneratorOptions> {
  /** Generate files based on options */
  generate(): Promise<GeneratorResult>;

  /** Validate options before generation */
  validate(): Promise<ValidationResult>;

  /** Get the Zod schema for options validation */
  getSchema(): z.ZodSchema<T>;
}

/**
 * Monorepo generator options
 */
export interface MonorepoOptions extends GeneratorOptions {
  /** Project name */
  name: string;
  /** NPM scope (e.g., '@myapp') */
  scope: string;
  /** Project type */
  type: 'minimal' | 'full-stack';
  /** Bun version */
  bunVersion: string;
  /** Node.js version */
  nodeVersion: string;
  /** Include Docker configuration */
  includeDocker?: boolean;
  /** Include CI/CD configuration */
  includeCI?: boolean;
  /** CI/CD provider */
  ciProvider?: 'github' | 'gitlab';
  /** Database support */
  databases?: SupportedDatabase[];
  /** Skip dependency installation */
  skipInstall?: boolean;
  /** Skip git initialization */
  skipGit?: boolean;
}

/**
 * App generator options
 */
export interface AppOptions extends GeneratorOptions {
  /** App name */
  name: string;
  /** App type */
  type: 'web-react-ssr' | 'scripts';
  /** Project scope */
  scope: string;
}

/**
 * Package generator options
 */
export interface PackageOptions extends GeneratorOptions {
  /** Package name */
  name: string;
  /** Package type */
  type: 'configs' | 'utils' | 'types' | 'logger' | 'database';
  /** Project scope */
  scope: string;
  /** Include build script */
  includeBuild?: boolean;
  /** Include tests */
  includeTests?: boolean;
}

/**
 * Docker generator options
 */
export interface DockerOptions extends GeneratorOptions {
  /** Services to include */
  services?: ('postgres' | 'neo4j' | 'redis' | 'sqlite3' | 'kafka')[];
  /** Include web service */
  includeWeb?: boolean;
}

/**
 * CI/CD generator options
 */
export interface CIOptions extends GeneratorOptions {
  /** CI provider */
  provider: 'github' | 'gitlab';
  /** Include deployment workflow */
  includeDeploy?: boolean;
}
