/**
 * New project prompts
 * Interactive prompts for creating a new project
 */

import inquirer from 'inquirer';
import type { MonorepoOptions } from '../types/generator.js';

export type SupportedDatabase = 'mysql' | 'postgres' | 'sqlite3' | 'neo4j' | 'edgedb';

export interface NewProjectAnswers {
  name: string;
  scope: string;
  type: 'minimal' | 'full-stack';
  bunVersion: string;
  nodeVersion: string;
  includeDocker: boolean;
  includeCI: boolean;
  ciProvider?: 'github' | 'gitlab';
  databases?: SupportedDatabase[];
}

export async function promptNewProject(
  initialName?: string
): Promise<Partial<MonorepoOptions>> {
  const answers = await inquirer.prompt<NewProjectAnswers>([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: initialName || 'my-app',
      validate: (input: string) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Project name must be lowercase, alphanumeric, and may contain hyphens';
        }
        if (input.startsWith('-') || input.endsWith('-')) {
          return 'Project name cannot start or end with a hyphen';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'scope',
      message: 'NPM scope (e.g., @myapp):',
      default: (answers: NewProjectAnswers) => `@${answers.name}`,
      validate: (input: string) => {
        if (!/^@[a-z0-9-]+$/.test(input)) {
          return 'Scope must start with @ and contain lowercase alphanumeric characters';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'type',
      message: 'Project type:',
      choices: [
        { name: 'Minimal - Basic monorepo with web app', value: 'minimal' },
        { name: 'Full-Stack - Includes database support', value: 'full-stack' },
      ],
      default: 'minimal',
    },
    {
      type: 'confirm',
      name: 'includeDocker',
      message: 'Include Docker configuration?',
      default: false,
      when: (answers: NewProjectAnswers) => answers.type === 'full-stack',
    },
    {
      type: 'checkbox',
      name: 'databases',
      message: 'Select databases:',
      choices: [
        { name: 'PostgreSQL', value: 'postgres' },
        { name: 'Neo4j', value: 'neo4j' },
        { name: 'Sqlite3', value: 'sqlite3' },
      ],
      when: (answers: NewProjectAnswers) => answers.type === 'full-stack',
    },
    {
      type: 'confirm',
      name: 'includeCI',
      message: 'Include CI/CD configuration?',
      default: false,
    },
    {
      type: 'list',
      name: 'ciProvider',
      message: 'Select CI/CD provider:',
      choices: [
        { name: 'GitHub Actions', value: 'github' },
        { name: 'GitLab CI', value: 'gitlab' },
      ],
      when: (answers: NewProjectAnswers) => answers.includeCI,
    },
  ]);

  return {
    name: answers.name,
    scope: answers.scope,
    type: answers.type,
    bunVersion: '1.3.5',
    nodeVersion: '25.0.0',
    includeDocker: answers.includeDocker || false,
    includeCI: answers.includeCI || false,
    ciProvider: answers.ciProvider,
    databases: answers.databases,
  };
}
