/**
 * Configuration type definitions
 * Types for project configuration and settings
 */

/**
 * NixRails configuration file
 * Optional file that can be placed in generated projects
 */
export interface NixRailsConfig {
  /** Config version */
  version: string;
  /** Project type */
  type: 'minimal' | 'full-stack' | 'frontend' | 'backend';
  /** NPM scope */
  scope: string;
  /** Apps in the workspace */
  apps: AppConfig[];
  /** Packages in the workspace */
  packages: PackageConfig[];
  /** Tool versions */
  tools: ToolVersions;
  /** Feature flags */
  features: FeatureFlags;
}

/**
 * App configuration
 */
export interface AppConfig {
  /** App name */
  name: string;
  /** App type */
  type: 'web' | 'api' | 'scripts';
  /** Framework (for web apps) */
  framework?: 'react' | 'next' | 'remix';
  /** Language (for API apps) */
  language?: 'typescript' | 'rust';
}

/**
 * Package configuration
 */
export interface PackageConfig {
  /** Package name */
  name: string;
  /** Package type */
  type: 'configs' | 'utils' | 'types' | 'logger' | 'database' | 'components';
}

/**
 * Tool versions
 */
export interface ToolVersions {
  /** Bun version */
  bun: string;
  /** Node.js version */
  node: string;
  /** Rust version (optional) */
  rust?: string;
  /** Turborepo version */
  turbo?: string;
  /** TypeScript version */
  typescript?: string;
}

/**
 * Feature flags
 */
export interface FeatureFlags {
  /** Docker support enabled */
  docker: boolean;
  /** CI/CD provider */
  ci?: 'github' | 'gitlab' | null;
  /** Database support */
  databases?: ('postgres' | 'neo4j')[];
}

/**
 * CLI configuration options
 */
export interface CLIConfig {
  /** Default Bun version */
  defaultBunVersion: string;
  /** Default Node.js version */
  defaultNodeVersion: string;
  /** Default Turborepo version */
  defaultTurboVersion: string;
  /** Default TypeScript version */
  defaultTypescriptVersion: string;
  /** Template directory path */
  templateDir: string;
}
