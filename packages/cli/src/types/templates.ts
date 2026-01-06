/**
 * Template type definitions
 * Types for template context and rendering
 */

/**
 * Base template context
 * Variables available to all templates
 */
export interface TemplateContext {
  /** Project name (kebab-case) */
  projectName: string;
  /** Project name (PascalCase) */
  projectNamePascal?: string;
  /** Project scope (@scope) */
  projectScope: string;
  /** Scope without @ prefix */
  scopeName: string;
  /** Project type */
  projectType: 'minimal' | 'full-stack' | 'frontend' | 'backend';
  /** Bun version */
  bunVersion: string;
  /** Node.js version */
  nodeVersion: string;
  /** Turborepo version */
  turboVersion: string;
  /** TypeScript version */
  typescriptVersion: string;
  /** Current year */
  year: string;
  /** Current date (YYYY-MM-DD) */
  date: string;
  /** Git author name */
  author?: string;
  /** Git author email */
  email?: string;
}

/**
 * App template context
 * Additional variables for app templates
 */
export interface AppTemplateContext extends TemplateContext {
  /** App name */
  appName: string;
  /** App name (PascalCase) */
  appNamePascal: string;
  /** App type */
  appType: 'web-react-ssr' | 'scripts' | 'api';
  /** Port number (for web apps) */
  port?: number;
}

/**
 * Package template context
 * Additional variables for package templates
 */
export interface PackageTemplateContext extends TemplateContext {
  /** Package name */
  packageName: string;
  /** Full package name with scope */
  packageFullName: string;
  /** Package type */
  packageType: 'configs' | 'utils' | 'types' | 'logger' | 'database' | 'components';
  /** Include build script */
  includeBuild: boolean;
  /** Include tests */
  includeTests: boolean;
}

/**
 * Docker template context
 */
export interface DockerTemplateContext extends TemplateContext {
  /** Include PostgreSQL */
  includePostgres: boolean;
  /** Include Neo4j */
  includeNeo4j: boolean;
  /** Include Redis */
  includeRedis: boolean;
  /** Include web service */
  includeWeb: boolean;
  /** PostgreSQL version */
  postgresVersion?: string;
  /** Neo4j version */
  neo4jVersion?: string;
  /** Redis version */
  redisVersion?: string;
}

/**
 * CI template context
 */
export interface CITemplateContext extends TemplateContext {
  /** CI provider */
  ciProvider: 'github' | 'gitlab';
  /** Include deployment workflow */
  includeDeploy: boolean;
}

/**
 * Template file metadata
 */
export interface TemplateFile {
  /** Source path (relative to templates directory) */
  sourcePath: string;
  /** Destination path (relative to output directory) */
  destinationPath: string;
  /** Whether this is a Handlebars template */
  isTemplate: boolean;
}
