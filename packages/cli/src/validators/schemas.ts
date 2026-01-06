/**
 * Validation schemas
 * Zod schemas for validating generator options
 */

import { z } from 'zod';

/**
 * Base generator options schema
 */
export const baseGeneratorOptionsSchema = z.object({
  outputPath: z.string().optional(),
  dryRun: z.boolean().optional().default(false),
  force: z.boolean().optional().default(false),
  verbose: z.boolean().optional().default(false),
});

/**
 * Project name validation
 * Must be a valid npm package name (lowercase, alphanumeric, hyphens)
 */
const projectNameSchema = z
  .string()
  .min(1, 'Project name is required')
  .regex(/^[a-z0-9-]+$/, 'Project name must be lowercase, alphanumeric, and may contain hyphens')
  .refine((name) => !name.startsWith('-') && !name.endsWith('-'), {
    message: 'Project name cannot start or end with a hyphen',
  });

/**
 * NPM scope validation
 * Must start with @ and follow npm naming rules
 */
const scopeSchema = z
  .string()
  .regex(/^@[a-z0-9-]+$/, 'Scope must start with @ and contain lowercase alphanumeric characters')
  .refine((scope) => scope.length > 1, {
    message: 'Scope must not be empty',
  });

/**
 * Version string validation
 */
const versionSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 1.3.5)');

/**
 * Monorepo generator options schema
 */
export const monorepoOptionsSchema = baseGeneratorOptionsSchema.extend({
  name: projectNameSchema,
  scope: scopeSchema,
  type: z.enum(['minimal', 'full-stack']),
  bunVersion: versionSchema,
  nodeVersion: versionSchema,
  includeDocker: z.boolean().optional().default(false),
  includeCI: z.boolean().optional().default(false),
  ciProvider: z.enum(['github', 'gitlab']).optional(),
  databases: z.array(z.enum(['postgres', 'neo4j'])).optional(),
  skipInstall: z.boolean().optional().default(false),
  skipGit: z.boolean().optional().default(false),
});

/**
 * App generator options schema
 */
export const appOptionsSchema = baseGeneratorOptionsSchema.extend({
  name: projectNameSchema,
  type: z.enum(['web-react-ssr', 'scripts']),
  scope: scopeSchema,
});

/**
 * Package generator options schema
 */
export const packageOptionsSchema = baseGeneratorOptionsSchema.extend({
  name: projectNameSchema,
  type: z.enum(['configs', 'utils', 'types', 'logger', 'database']),
  scope: scopeSchema,
  includeBuild: z.boolean().optional().default(true),
  includeTests: z.boolean().optional().default(true),
});

/**
 * Docker generator options schema
 */
export const dockerOptionsSchema = baseGeneratorOptionsSchema.extend({
  services: z.array(z.enum(['postgres', 'neo4j', 'redis'])).optional(),
  includeWeb: z.boolean().optional().default(true),
});

/**
 * CI generator options schema
 */
export const ciOptionsSchema = baseGeneratorOptionsSchema.extend({
  provider: z.enum(['github', 'gitlab']),
  includeDeploy: z.boolean().optional().default(false),
});

/**
 * Type exports for inferred types
 */
export type MonorepoOptions = z.infer<typeof monorepoOptionsSchema>;
export type AppOptions = z.infer<typeof appOptionsSchema>;
export type PackageOptions = z.infer<typeof packageOptionsSchema>;
export type DockerOptions = z.infer<typeof dockerOptionsSchema>;
export type CIOptions = z.infer<typeof ciOptionsSchema>;
