/**
 * Logger utility
 * Provides formatted console logging with colors and spinners
 */

import chalk from 'chalk';
import debug from 'debug';
import ora, { type Ora } from 'ora';

export class Logger {
  private log: debug.Debugger
  private namespace: string;
  private verbose: boolean;
  private spinner: Ora | null = null;

  constructor(namespace: string, verbose = false) {
    this.namespace = namespace;
    this.verbose = verbose;
    this.log = debug(`nix-rails:${this.namespace}`);
  }

  enable() {
    this.log.enabled = true;
  }

  disable() {
    this.log.enabled = false;
  }

  info(message: string, ...args: any[]): void {
    this.log.extend('info')(message, ...args);
  }

  success(message: string, ...args: any[]): void {
    this.log.extend('success')(chalk.green(message), ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log.extend('warn')(chalk.yellow(message), ...args);
  }

  error(message: string, error?: Error, ...args: any[]): void {
    const _error = this.log.extend('error');
    _error(chalk.red(message), ...args);
    if (error && this.verbose) {
      _error(chalk.red(error.stack || error.message));
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.verbose) {
      this.log.extend('debug')(chalk.gray('🔍'), chalk.gray(message), ...args);
    }
  }

  startSpinner(message: string): void {
    this.spinner = ora({
      text: message,
      color: 'cyan',
    }).start();
  }

  updateSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(name: string, verbose = false): Logger {
  return new Logger(name, verbose);
}
