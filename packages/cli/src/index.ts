/**
 * @nixrails/cli
 * Main exports for the NixRails scaffolding engine
 */

export * from './types/generator.js';
export * from './types/config.js';
export * from './types/templates.js';

export * from './generators/base/Generator.js';
export * from './generators/base/TemplateRenderer.js';
export * from './generators/MonorepoGenerator.js';
export * from './generators/AppGenerator.js';
export * from './generators/PackageGenerator.js';

export * from './utils/logger.js';
