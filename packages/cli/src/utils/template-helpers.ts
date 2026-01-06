/**
 * Template helpers
 * Handlebars helper functions for template rendering
 */

/**
 * Convert string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase());
}

/**
 * Convert string to camelCase
 */
export function camelCase(str: string): string {
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Get current year
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}

/**
 * Get current date in ISO format (YYYY-MM-DD)
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Pluralize a word
 */
export function pluralize(word: string): string {
  if (word.endsWith('s')) return word;
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  if (word.endsWith('sh') || word.endsWith('ch')) return word + 'es';
  return word + 's';
}

/**
 * Check if two values are equal (for Handlebars if_eq helper)
 */
export function eq(a: any, b: any): boolean {
  return a === b;
}

/**
 * Register all helpers with Handlebars
 */
export function registerHelpers(handlebars: typeof import('handlebars')): void {
  handlebars.registerHelper('kebabCase', kebabCase);
  handlebars.registerHelper('pascalCase', pascalCase);
  handlebars.registerHelper('camelCase', camelCase);
  handlebars.registerHelper('snakeCase', snakeCase);
  handlebars.registerHelper('year', getCurrentYear);
  handlebars.registerHelper('date', getCurrentDate);
  handlebars.registerHelper('pluralize', pluralize);

  // Conditional helper
  handlebars.registerHelper('if_eq', function (this: any, a: any, b: any, options: any) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse ? options.inverse(this) : '';
  });

  // Unless equal helper
  handlebars.registerHelper('unless_eq', function (this: any, a: any, b: any, options: any) {
    if (a !== b) {
      return options.fn(this);
    }
    return options.inverse ? options.inverse(this) : '';
  });

  // Includes helper (check if array includes value)
  // Can be used as SubExpression: {{#if (includes array value)}}
  // Or as block helper: {{#includes array value}}
  handlebars.registerHelper('includes', function (this: any, array: any[], value: any, options?: any) {
    const included = array && Array.isArray(array) && array.includes(value);

    // SubExpression usage (returns boolean) - when called without block
    if (!options || typeof options.fn !== 'function') {
      return included;
    }

    // Block helper usage
    if (included) {
      return options.fn(this);
    }
    return options.inverse ? options.inverse(this) : '';
  });
}
