# NixRails Scaffolding Engine Implementation Plan

 Project Overview

 Building a CLI scaffolding engine nix-rails that generates production-ready Bun Turborepo workspaces based on proven patterns
 from:

- Project-Johto/Pokemon: Full-stack monorepo (Bun + React SSR + Rust APIs + PostgreSQL/Neo4j)
- Project-Arcturus/Arcturus-JR: Frontend-focused monorepo (Bun + React 19 SSR + Design System + Webpack)

 Reference Project Analysis Summary

 Project-Johto/Pokemon Key Patterns

 Structure:

- Turborepo with apps/ and packages/ workspaces
- Multi-language: TypeScript (Bun) + Rust (Actix-web)
- Scoped packages: @pokemon/*
- Separate bundle + type generation steps
- Docker multi-stage builds with health checks
- Handlebars templates for scaffolding (existing in apps/scripts/)

 Tech Stack:

- Bun 1.3.5, Node 24.6.0, Rust 1.92.0
- React 19 SSR, Actix-web GraphQL
- PostgreSQL, Neo4j
- Turborepo 2.3.0
- mise for tool/task management

 Build Patterns:

- build.ts files using Bun.build API
- npm-run-all for sequential script execution
- TypeScript compiler for type declarations only
- Content-addressed browser bundles with hashes

 Project-Arcturus/Arcturus-JR Unique Patterns

 Additional Features:

- React 19 static prerendering with TanStack Query
- Style Dictionary for cross-platform design tokens
- Webpack 5 with ES module output + thread-loader
- Component/View separation pattern
- Dual ESM/CJS package builds
- Advanced code splitting (react-runtime, vendors, common)
- GitHub Actions CI/CD with AWS deployment
- PostCSS utilities as shared package
- Bun 1.3.2, Node 24.6.0

 Design System:

- Three-layer: Tokens → CSS → Components
- Void design system (dark theme, neon accents)
- CSS custom properties with --void-* prefix
- Storybook integration

 Implementation Approach

 Phase 1: Foundation & CLI Setup

 Goal: Create basic project structure and CLI framework

 Deliverables:

 1. NixRails project structure (Turborepo monorepo itself)
 2. CLI package with Commander.js
 3. Template system using Handlebars
 4. File generation utilities
 5. Basic validation

 Phase 2: Template Creation

 Goal: Build templates for all archetypes based on reference projects

 Templates Needed:

 1. Base Monorepo Template:

- Root package.json, turbo.json, .mise.toml
- .gitignore, tsconfig.json, bunfig.toml
- Directory structure (apps/, packages/)

 1. App Templates:

- web-react-ssr (from Pokemon/Arcturus patterns)
- rust-api (from Pokemon tcg-api)
- bun-scripts (from Pokemon scripts)

 1. Package Templates:

- @configs/typescript (shared TS configs)
- @utils (utilities)
- @types (TypeScript types)
- void-components style (design system)
- void-tokens style (Style Dictionary)

 1. Infrastructure Templates:

- Dockerfile.web (multi-stage)
- docker-compose.yml (with includes pattern)
- GitHub Actions workflows (from Arcturus)

 Phase 3: Code Generators

 Goal: Implement generator classes for each archetype

 Generators:

 1. MonorepoGenerator:

- Creates base structure
- Generates root configs
- Initializes git
- Runs bun install

 1. AppGenerator:

- Web (React SSR with choice of Webpack/Bun)
- API (Rust with Actix-web)
- Scripts (CLI with Commander)

 1. PackageGenerator:

- TypeScript library
- Design system (tokens, CSS, components)
- Shared configs

 1. InfrastructureGenerator:

- Docker configurations
- CI/CD workflows
- Database services

 Phase 4: Pattern Analyzers (Optional Enhancement)

 Goal: Programmatically extract patterns from reference projects

 Could analyze:

- Dependency patterns
- Script patterns
- Configuration patterns

 Note: May defer to future phase as templates can be created manually first.

 Phase 5: Polish & Testing

 Goal: Production-ready CLI tool

 Tasks:

 1. Interactive prompts with validation
 2. Comprehensive error handling
 3. Unit tests for generators
 4. Integration tests (generate → build → run)
 5. CLI help documentation
 6. README and examples

 Technical Architecture

 Project Structure

 nix-rails/
 ├── packages/
 │   ├── cli/                      # CLI application
 │   │   ├── bin/
 │   │   │   └── nixrails.js      # Executable entry point
 │   │   ├── src/
 │   │   │   ├── commands/        # Command handlers
 │   │   │   │   ├── new.ts       # Create new project
 │   │   │   │   ├── init.ts      # Initialize in current dir
 │   │   │   │   ├── add.ts       # Add app/package
 │   │   │   │   └── generate.ts  # Generate component/route
 │   │   │   ├── generators/      # Code generators
 │   │   │   │   ├── base.ts
 │   │   │   │   ├── monorepo.ts
 │   │   │   │   ├── app.ts
 │   │   │   │   ├── package.ts
 │   │   │   │   └── infrastructure.ts
 │   │   │   ├── templates/       # Template utilities
 │   │   │   │   ├── parser.ts
 │   │   │   │   └── validator.ts
 │   │   │   ├── prompts/         # Interactive prompts
 │   │   │   │   └── index.ts
 │   │   │   └── utils/           # Utilities
 │   │   │       ├── files.ts
 │   │   │       └── validators.ts
 │   │   └── package.json
 │   ├── templates/                # Template files
 │   │   ├── base/                # Base monorepo
 │   │   │   ├── package.json.hbs
 │   │   │   ├── turbo.json.hbs
 │   │   │   ├── mise.toml.hbs
 │   │   │   ├── tsconfig.json.hbs
 │   │   │   ├── .gitignore
 │   │   │   └── README.md.hbs
 │   │   ├── apps/                # App templates
 │   │   │   ├── web-react-ssr/
 │   │   │   │   ├── package.json.hbs
 │   │   │   │   ├── tsconfig.json.hbs
 │   │   │   │   ├── src/
 │   │   │   │   │   ├── index.tsx.hbs
 │   │   │   │   │   ├── dev.ts.hbs
 │   │   │   │   │   └── ...
 │   │   │   │   └── Dockerfile.hbs
 │   │   │   ├── rust-api/
 │   │   │   │   ├── Cargo.toml.hbs
 │   │   │   │   ├── src/
 │   │   │   │   │   └── main.rs.hbs
 │   │   │   │   └── Dockerfile.hbs
 │   │   │   └── bun-scripts/
 │   │   └── packages/            # Package templates
 │   │       ├── configs-typescript/
 │   │       ├── utils/
 │   │       ├── types/
 │   │       └── void-components/
 │   └── core/                     # Shared types/utilities
 │       ├── src/
 │       │   ├── types.ts
 │       │   └── constants.ts
 │       └── package.json
 ├── turbo.json                    # NixRails own config
 ├── package.json                  # NixRails root
 ├── .mise.toml
 └── README.md

 Template Variables

 interface TemplateContext {
   PROJECT_NAME: string;           // "my-app"
   PROJECT_SCOPE: string;          // "@myapp"
   APP_NAME?: string;              // "web", "api"
   PACKAGE_NAME?: string;          // "utils", "types"
   BUN_VERSION: string;            // "1.3.5"
   NODE_VERSION: string;           // "24.6.0"
   RUST_VERSION?: string;          // "1.92.0"
   TURBO_VERSION: string;          // "2.6.1"
   TYPESCRIPT_VERSION: string;     // "5.5.4"
   YEAR: string;                   // "2026"
   DATE: string;                   // "2026-01-05"
   AUTHOR?: string;                // From git config
   EMAIL?: string;                 // From git config
 }

 CLI Commands

# Create new project

 nixrails new <project-name> [--type full-stack|frontend|minimal|backend]
   --scope <scope>        # NPM scope
   --bun <version>
   --node <version>
   --rust <version>
   --no-docker
   --no-ci
   --no-install
   --no-git

# Initialize in existing directory

 nixrails init [--type <type>] [--force]

# Add app

 nixrails add app <app-name> --type web|api|scripts

# Add package

 nixrails add package <package-name> --type utils|configs|types|components

# Add infrastructure

 nixrails add docker [--services postgres|neo4j|redis]
 nixrails add ci --provider github|gitlab

# Generate code

 nixrails generate component <name> --app <app-name>
 nixrails generate route <name> --app <app-name>

# Utility

 nixrails info
 nixrails validate
 nixrails --version
 nixrails --help

 Technology Stack

 Core:

- Runtime: Bun 1.3+
- Language: TypeScript (strict mode)
- CLI: Commander.js
- Templating: Handlebars
- Validation: Zod
- File System: Node.js fs + Bun optimizations
- Testing: Bun test runner

 Dependencies:
 {
   "dependencies": {
     "commander": "^11.0.0",
     "handlebars": "^4.7.8",
     "chalk": "^5.3.0",
     "ora": "^7.0.1",
     "inquirer": "^9.2.11",
     "fs-extra": "^11.1.1",
     "zod": "^3.22.4"
   }
 }

 Project Archetypes

 1. Full-Stack Monorepo (Pokemon-style)

 Generated:

- apps/web (React SSR)
- apps/api (Rust)
- packages/@configs, @database, @utils, @types
- docker/ setup
- PostgreSQL/Neo4j configs

 1. Frontend-Focused (Arcturus-style)

 Generated:

- apps/web (React SSR + prerendering)
- packages/void-components, void-tokens, void-css
- packages/config, types
- .github/workflows
- Webpack config

 1. Minimal Monorepo

 Generated:

- apps/web (basic React)
- packages/@configs, @utils
- Basic configuration only

 1. Backend-Heavy

 Generated:

- apps/api, apps/worker (Rust)
- apps/scripts (TypeScript)
- packages/@configs
- docker/ setup

 Critical Files to Generate

 Root Level:

 1. package.json - Workspace config
 2. .mise.toml - Tool versions + tasks
 3. turbo.json - Turborepo pipeline
 4. tsconfig.json - Base TypeScript config
 5. .gitignore - Standard ignores
 6. .prettierrc - Code formatting
 7. bunfig.toml - Bun configuration

 For Web App:

 1. package.json with scripts
 2. tsconfig.json extending base
 3. src/index.tsx - SSR entry
 4. src/dev.ts - Dev mode
 5. src/build/browser.ts - Build script
 6. Dockerfile - Multi-stage

 For Packages:

 1. package.json with exports
 2. tsconfig.json extending base
 3. build.ts - Bun build script
 4. lib/index.ts - Entry point

 Implementation Priorities

 MVP (Minimum Viable Product)

 Focus: Get one archetype working end-to-end

 Must Have:

 1. CLI with new command
 2. Minimal monorepo template
 3. Basic web app template
 4. Basic package template
 5. Template parser with variable substitution
 6. Post-generation steps (git init, bun install)

 Success Criteria:

- Can run nixrails new my-app --type minimal
- Generated project builds successfully
- Generated project passes type checks
- Can run bun run dev and see working app

 Phase 2 (Enhanced)

 Add:

 1. Full-stack archetype
 2. Frontend-focused archetype
 3. add app and add package commands
 4. Docker template generation
 5. Interactive prompts

 Phase 3 (Production)

 Add:

 1. CI/CD templates
 2. Component/route generators
 3. Comprehensive tests
 4. Documentation
 5. Error handling and validation

 Detailed Implementation Roadmap

 Phase 1: Foundation & CLI Setup

 Goal: Create the NixRails project structure and basic CLI framework

 Steps:

 1. Initialize NixRails monorepo (/home/nicks-dgx/dev/.Project-NixRails/nix-rails/)

- Create root package.json with Turborepo workspace
- Set up .mise.toml with Bun/Node tools
- Create turbo.json for build orchestration
- Add .gitignore

 1. Create CLI package structure (packages/cli/)

- Set up package.json with bin entry point
- Create src/ directory with TypeScript files
- Set up tsconfig.json extending base config
- Create build.ts for Bun.build

 1. Implement base generator classes:

- src/generators/base/Generator.ts - Abstract base class
- src/generators/base/TemplateRenderer.ts - Handlebars renderer
- src/generators/base/FileGenerator.ts - File operations

 1. Implement utility modules:

- src/utils/files.ts - File system operations
- src/utils/logger.ts - Console logger with chalk/ora
- src/utils/git.ts - Git initialization
- src/utils/package-manager.ts - Bun install wrapper
- src/utils/template-helpers.ts - Handlebars helpers

 1. Create type definitions:

- src/types/generator.ts - Generator interfaces
- src/types/config.ts - Configuration types
- src/types/templates.ts - Template context types

 1. Set up validation:

- src/validators/schemas.ts - Zod schemas
- src/validators/ProjectValidator.ts - Project structure validation

 Deliverable: Working CLI package that can be run locally

 Phase 2: Template Creation (Base Monorepo)

 Goal: Create templates for base monorepo structure

 Templates to Create:

 1. Root templates (templates/base/root/)

- package.json.hbs - Workspace root manifest
- turbo.json.hbs - Turborepo configuration
- .mise.toml.hbs - Tool management
- tsconfig.json.hbs - Base TypeScript config
- .gitignore.hbs - Standard ignores
- .env.example.hbs - Environment template
- README.md.hbs - Project README

 1. Config package template (templates/packages/configs/)

- package.json.hbs
- typescript/base.tsconfig.json.hbs
- typescript/bun.tsconfig.json.hbs
- typescript/react.tsconfig.json.hbs

 1. Utils package template (templates/packages/utils/)

- package.json.hbs
- tsconfig.json.hbs
- build.ts.hbs - Bun.build script
- lib/index.ts.hbs
- __tests__/index.test.ts.hbs

 1. Types package template (templates/packages/types/)

- package.json.hbs
- tsconfig.json.hbs
- lib/index.ts.hbs

 1. Logger package template (templates/packages/logger/)

- package.json.hbs
- tsconfig.json.hbs
- build.ts.hbs
- lib/index.ts.hbs

 Deliverable: Complete base monorepo templates

 Phase 3: Web App Template

 Goal: Create React SSR web app template

 Templates to Create:

 1. Web app structure (templates/apps/web-react-ssr/)

- package.json.hbs - App manifest with dependencies
- tsconfig.json.hbs - Extends @configs/typescript/react
- src/index.tsx.hbs - Server entry point
- src/dev.ts.hbs - Development mode with hot reload
- src/server/server.ts.hbs - Bun HTTP server
- src/web/App.tsx.hbs - Root React component
- src/web/browser/index.ts.hbs - Client entry
- src/build/browser.ts.hbs - Bun.build script
- public/css/index.css - Basic styles

 Deliverable: Working React SSR app template

 Phase 4: Generator Implementation

 Goal: Implement generator classes that use the templates

 Files to Create:

 1. MonorepoGenerator (src/generators/MonorepoGenerator.ts)

- Orchestrates entire project generation
- Creates directory structure
- Renders templates with context
- Runs post-generation hooks (git init, bun install)

 1. AppGenerator (src/generators/AppGenerator.ts)

- Generates apps from templates
- Supports web-react-ssr type

 1. PackageGenerator (src/generators/PackageGenerator.ts)

- Generates packages from templates
- Supports configs, utils, types, logger types

 Deliverable: Working generator classes

 Phase 5: CLI Commands

 Goal: Implement CLI command handlers

 Files to Create:

 1. CLI entry point (bin/nixrails.ts)

- Executable with shebang
- Imports and runs main CLI

 1. Main CLI (src/cli.ts)

- Sets up Commander program
- Registers all commands

 1. New command (src/commands/new.ts)

- nixrails new <name> implementation
- Interactive prompts for configuration
- Calls MonorepoGenerator

 1. Interactive prompts (src/prompts/NewProjectPrompts.ts)

- Inquirer prompts for project setup
- Validation of inputs

 Deliverable: Working nixrails new command

 Phase 6: Testing & Polish (Phase 1 MVP Complete)

 Goal: Ensure generated projects work correctly

 Tasks:

 1. Test generation of minimal monorepo
 2. Verify generated project builds (bun run build)
 3. Verify generated project type-checks (bun run check-types)
 4. Verify dev mode works (bun run dev)
 5. Add error handling
 6. Improve logging and user feedback
 7. Add dry-run mode

 Deliverable: Phase 1 MVP - Working minimal monorepo generation

 Phase 7: Database Support (Phase 2 Start)

 Goal: Add database package and templates

 Templates to Create:

 1. Database package (templates/packages/database/)

- package.json.hbs - With pg and neo4j-driver dependencies
- tsconfig.json.hbs
- build.ts.hbs
- lib/index.ts.hbs
- lib/postgres.ts.hbs - PostgreSQL client
- lib/neo4j.ts.hbs - Neo4j client

 Update MonorepoGenerator:

- Add option to include database package
- Include in full-stack archetype

 Deliverable: Database utilities package

 Phase 8: Docker Support (Phase 2 Continue)

 Goal: Add Docker configuration generation

 Templates to Create:

 1. Docker templates (templates/docker/)

- Dockerfile.web.hbs - Multi-stage web app build
- docker-compose.yml.hbs - Main compose with includes
- docker-compose.web.yml.hbs - Web service
- database/docker-compose.yml.hbs - Database services

 Files to Create:

 1. DockerGenerator (src/generators/DockerGenerator.ts)

- Generates Docker configurations
- Supports PostgreSQL and Neo4j services

 1. Add docker command (src/commands/add/docker.ts)

- nixrails add docker implementation

 Deliverable: Docker configuration generation

 Phase 9: CI/CD Support (Phase 3)

 Goal: Add GitHub Actions templates

 Templates to Create:

 1. GitHub Actions (templates/ci/github/workflows/)

- ci.yaml.hbs - Lint, test, build workflow
- deploy.yaml.hbs - Optional deployment workflow

 Files to Create:

 1. CIGenerator (src/generators/CIGenerator.ts)

- Generates CI/CD configurations

 1. Add ci command (src/commands/add/ci.ts)

- nixrails add ci --provider github implementation

 Deliverable: CI/CD configuration generation

 Phase 10: Additional Commands (Enhancement)

 Goal: Add utility commands

 Files to Create:

 1. Add app command (src/commands/add/app.ts)

- Add new app to existing monorepo

 1. Add package command (src/commands/add/package.ts)

- Add new package to existing monorepo

 1. Info command (src/commands/info.ts)

- Display project information

 1. Validate command (src/commands/validate.ts)

- Validate project structure

 Deliverable: Complete CLI tool with all commands

 Critical Files & Order of Implementation

 Phase 1 (Must implement first):

 1. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/package.json - Root workspace
 2. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/turbo.json - Turborepo config
 3. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/.mise.toml - Tool management
 4. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/package.json - CLI manifest
 5. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/generators/base/Generator.ts
 6. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/generators/base/TemplateRenderer.ts
 7. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/utils/files.ts

 Phase 2 (Templates):
 8. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/templates/base/root/package.json.hbs
 9. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/templates/base/root/turbo.json.hbs
 10. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/templates/base/root/.mise.toml.hbs
 11. All package templates (configs, utils, types, logger)

 Phase 3 (Generators):
 12. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/generators/MonorepoGenerator.ts
 13. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/generators/AppGenerator.ts
 14. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/generators/PackageGenerator.ts

 Phase 4 (CLI):
 15. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/bin/nixrails.ts
 16. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/cli.ts
 17. /home/nicks-dgx/dev/.Project-NixRails/nix-rails/packages/cli/src/commands/new.ts

 Success Metrics

 Phase 1 Complete When:

- Can run nixrails new my-app
- Generates valid monorepo structure
- Generated project runs bun install successfully
- Generated project builds with bun run build
- Generated web app starts with bun run dev

 Phase 2 Complete When:

- Can add Docker with nixrails add docker
- Docker compose starts all services
- Database connections work

 Phase 3 Complete When:

- Can add CI with nixrails add ci --provider github
- GitHub Actions workflow passes

 User Decisions (Confirmed)

 1. Archetype Focus: Between Minimal and Full-Stack

- Focus on Bun + React SSR + databases
- NO Rust support initially (defer to future)
- Include PostgreSQL/Neo4j database patterns

 1. Complexity Approach: Progressive Build

- Phase 1: Core essentials (monorepo, web app, packages)
- Phase 2: Docker orchestration + databases
- Phase 3: CI/CD support

 1. Distribution: Embedded templates in CLI package

- Single npm/bun package for easier distribution
- Templates bundled with the CLI tool

 1. Template Strategy: Simplified new templates

- Inspired by reference projects, not exact copies
- Easier to maintain and understand
