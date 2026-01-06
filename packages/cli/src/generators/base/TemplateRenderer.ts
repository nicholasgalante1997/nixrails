/**
 * Template renderer
 * Handles Handlebars template rendering with custom helpers
 */

import Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { registerHelpers } from '../../utils/template-helpers.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger('TemplateRenderer');

export class TemplateRenderer {
  private handlebars: typeof Handlebars;
  private templateCache: Map<string, HandlebarsTemplateDelegate>;

  constructor() {
    this.handlebars = Handlebars.create();
    this.templateCache = new Map();
    this.registerAllHelpers();
  }

  /**
   * Register all Handlebars helpers
   */
  private registerAllHelpers(): void {
    registerHelpers(this.handlebars);
  }

  /**
   * Render a template file with the given context
   */
  async renderFile(templatePath: string, context: Record<string, any>): Promise<string> {
    try {
      // Check cache first
      let template = this.templateCache.get(templatePath);

      if (!template) {
        const templateContent = await readFile(templatePath, 'utf-8');
        template = this.handlebars.compile(templateContent);
        this.templateCache.set(templatePath, template);
        logger.debug(`Compiled template: ${templatePath}`);
      }

      return template(context);
    } catch (error) {
      logger.error(`Failed to render template: ${templatePath}`, error as Error);
      throw error;
    }
  }

  /**
   * Render a template string with the given context
   */
  renderString(templateString: string, context: Record<string, any>): string {
    try {
      const template = this.handlebars.compile(templateString);
      return template(context);
    } catch (error) {
      logger.error('Failed to render template string', error as Error);
      throw error;
    }
  }

  /**
   * Register a custom helper
   */
  registerHelper(name: string, helper: Handlebars.HelperDelegate): void {
    this.handlebars.registerHelper(name, helper);
  }

  /**
   * Register a partial
   */
  registerPartial(name: string, partial: string): void {
    this.handlebars.registerPartial(name, partial);
  }

  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
  }
}
