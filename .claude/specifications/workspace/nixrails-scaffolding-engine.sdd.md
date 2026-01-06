# Spec-Driven Development: NixRails Scaffolding Engine

## Document Metadata

- **Document Type**: Spec-Driven Development (SDD) Prompt
- **Project**: Project-NixRails Scaffolding Engine
- **Version**: 1.0.0
- **Created**: 2026-01-05
- **Status**: Planning
- **Reference Projects**:
  - `.Project-Johto/Pokemon` (Bun Turborepo with Rust Backend)
  - `.Project-Arcturus/Arcturus-JR` (Bun Turborepo SSR Frontend)

---

## Executive Summary

The NixRails Scaffolding Engine is a project generation tool that creates production-ready Bun Turborepo workspaces based on proven patterns from Project-Johto and Project-Arcturus. The engine will analyze shared development practices, technology stacks, and architectural patterns to generate consistent, opinionated monorepo templates for new projects.

### Core Objectives

1. **Template Generation**: Create new Bun Turborepo workspaces with predefined structure
2. **Pattern Replication**: Replicate proven patterns from reference projects
3. **Technology Consistency**: Ensure consistent tooling (mise, Docker, Turborepo, Bun)
4. **Configuration Management**: Generate standard configuration files (.mise.toml, turbo.json, etc.)
5. **Extensibility**: Support multiple project archetypes (full-stack, frontend-only, backend-heavy)

---

## Analysis of Reference Projects

### Common Technology Stack

Both reference projects share a foundational technology stack:

| Technology | Pokemon | Arcturus-JR | Purpose |
|------------|---------|-------------|---------|
| **Bun** | 1.3.5 | 1.3.2 | Runtime, package manager |
| **Node.js** | 24.6.0 | 24.6.0 | Alternative runtime |
| **TypeScript** | 5.5.4 | Latest | Type safety |
| **Turborepo** | 2.3.0 | 2.6.1 | Monorepo orchestration |
| **mise** | Yes | Yes | Tool version management |
| **Docker** | Yes | Yes | Containerization |
| **React 19** | Yes (SSR) | Yes (SSR) | Frontend framework |

### Project-Johto/Pokemon Architecture

**Structure:**
```
Pokemon/
├── apps/
│   ├── web/                    # React 19 SSR (Bun runtime)
│   ├── tcg-api/                # Rust GraphQL API (Actix-web)
│   ├── distributed-ledger/     # Rust blockchain
│   └── scripts/                # Data management (Bun)
├── packages/
│   ├── @clients/               # API clients
│   ├── @configs/               # Shared TypeScript configs
│   │   └── typescript/         # bun.tsconfig.json, etc.
│   ├── @database/              # Database utilities
│   ├── @logger/                # Logging utilities
│   ├── @pokemon-data/          # Domain-specific data
│   └── @utils/                 # Shared utilities
├── docker/
│   └── database/               # Database docker-compose
├── database/                   # Local database files
├── .mise.toml                  # Tool versions and tasks
├── turbo.json                  # Turborepo pipeline
├── package.json                # Root workspace
├── Dockerfile.web              # Web app container
├── Dockerfile.seed             # Database seeding
├── docker-compose.yml          # Main services
└── docker-compose.web.yml      # Web-specific services
```

**Key Patterns:**
- Multi-language support (TypeScript, Rust)
- Multiple backend services (GraphQL API, blockchain)
- Database-first architecture (PostgreSQL, Neo4j)
- Scoped package naming: `@pokemon/*`
- Shared TypeScript configurations
- Docker orchestration for complex services
- mise tasks for common operations (install, build, dev, test, lint, clean)

**mise.toml Configuration:**
```toml
[tools]
bun = { version = "1.3.5", os = ["linux", "macos"] }
node = { version = "24.6.0", os = ["linux", "macos"] }
rust = { version = "1.92.0", os = ["linux", "macos"] }

[env]
_.file = [".env"]
_.path = ["{{config_root}}/node_modules/.bin"]

[tasks]
# Standardized tasks: install, test, lint, build, start, dev, serve, clean
```

### Project-Arcturus/Arcturus-JR Architecture

**Structure:**
```
Arcturus-JR/
├── apps/
│   └── web/                    # React 19 SSR with prerendering
│       ├── scripts/            # Build and prerender scripts
│       ├── webpack/            # Modular Webpack config
│       ├── src/
│       ├── nginx.conf          # Nginx configuration
│       └── Dockerfile          # Web container
├── packages/
│   ├── void-components/        # React component library
│   ├── void-tokens/            # Design tokens
│   ├── void-css/               # CSS utilities
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # Shared configuration
├── examples/                   # Example implementations
├── docs/                       # Documentation
├── .github/
│   ├── workflows/              # CI/CD workflows
│   │   ├── deploy.yaml
│   │   └── sanity-check.yaml
│   └── instructions/           # Development instructions
├── mise.toml                   # Tool versions and tasks
├── turbo.json                  # Turborepo pipeline
├── bunfig.toml                 # Bun configuration
└── package.json                # Root workspace
```

**Key Patterns:**
- Frontend-focused architecture
- Webpack-based build system (SWC compilation)
- Design system approach (tokens, components, CSS)
- Scoped package naming: `@arcjr/*`, `void-*`
- GitHub Actions for CI/CD
- Nginx for production serving
- Build-time prerendering
- mise tasks matching Pokemon structure

**mise.toml Configuration:**
```toml
[tools]
bun = { version = "1.3.2", os = ["linux", "macos"], postinstall = "..." }
node = { version = "24.6.0", os = ["linux", "macos"], postinstall = "..." }

[env]
_.file = [".env"]
_.path = ["{{config_root}}/node_modules/.bin"]

[tasks]
# Same standardized tasks as Pokemon
```

---

## Shared Patterns & Best Practices

### 1. Monorepo Structure

**Standard Layout:**
```
project-root/
├── apps/              # Application workspaces
├── packages/          # Shared libraries
├── docker/            # Docker configurations (optional)
├── docs/              # Documentation (optional)
├── .github/           # GitHub workflows (optional)
├── .claude/           # Claude Code configuration
├── .mise.toml         # Tool management
├── turbo.json         # Turborepo pipeline
├── package.json       # Root workspace
├── bunfig.toml        # Bun configuration (optional)
└── .env.example       # Environment template
```

### 2. Package Naming Conventions

**Scoped Packages:**
- Use organization scope: `@project-name/*`
- Domain-specific: `@pokemon/database`, `@arcjr/types`
- Feature-based: `@configs`, `@utils`, `@clients`
- Design system: `void-components`, `void-tokens`, `void-css`

**Naming Patterns:**
- `apps/*` - Individual applications
- `packages/@{scope}/*` - Scoped shared libraries
- `packages/{name}` - Unscoped shared libraries

### 3. Configuration Files

**Required Files:**

1. **package.json** (Root)
```json
{
  "name": "@project/root",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "clean": "turbo clean"
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "@types/bun": "latest"
  },
  "engines": {
    "bun": ">=1.3.2",
    "node": ">=24"
  },
  "packageManager": "bun@1.3.5"
}
```

2. **.mise.toml**
```toml
[tools]
bun = { version = "1.3.5", os = ["linux", "macos"] }
node = { version = "24.6.0", os = ["linux", "macos"] }
# Optional: rust, python, etc.

[env]
_.file = [".env"]
_.path = ["{{config_root}}/node_modules/.bin"]

[tasks.install]
description = "Installs all project dependencies"
run = "bun install --frozen-lockfile"

[tasks.test]
description = "Runs the test suite"
run = "bun run test"
depends = ["install"]

[tasks.lint]
description = "Runs the linter"
run = "bun run lint"
depends = ["install"]

[tasks.build]
description = "Builds the project"
run = "bun run build"
depends = ["install"]

[tasks.start]
description = "Starts the application"
run = "bun run start"
depends = ["build"]

[tasks.dev]
description = "Starts the application in development mode"
run = "bun run dev"
depends = ["install"]

[tasks.clean]
description = "Cleans the project build artifacts"
run = "bun run clean"
```

3. **turbo.json**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "clean": {
      "cache": false
    }
  }
}
```

4. **.gitignore**
```
node_modules/
dist/
build/
.turbo/
.env
.env.local
*.log
.DS_Store
```

### 4. TypeScript Configuration

**Root tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  }
}
```

**Shared TypeScript configs in `packages/@configs/typescript/`:**
- `bun.tsconfig.json` - Bun runtime config
- `react.tsconfig.json` - React apps config
- `library.tsconfig.json` - Shared packages config

### 5. Development Workflow

**Standard Scripts:**
- `mise run install` or `bun install` - Install dependencies
- `mise run dev` or `bun run dev` - Start development server
- `mise run build` or `bun run build` - Build for production
- `mise run test` or `bun run test` - Run tests
- `mise run lint` or `bun run lint` - Lint code
- `mise run clean` or `bun run clean` - Clean build artifacts

### 6. Docker Patterns

**Common Docker Setup:**

**Dockerfile.web** (Multi-stage build):
```dockerfile
# Stage 1: Dependencies
FROM oven/bun:1.3.5 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1.3.5 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 3: Production
FROM oven/bun:1.3.5-slim AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["bun", "run", "start"]
```

**docker-compose.yml** (Service orchestration):
```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - database

  database:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

### 7. Package Structure

**Standard Package Layout:**
```
packages/@scope/package-name/
├── lib/              # Source code
│   └── index.ts      # Entry point
├── package.json      # Package manifest
├── tsconfig.json     # TypeScript config
└── README.md         # Documentation
```

**Package package.json:**
```json
{
  "name": "@scope/package-name",
  "version": "0.0.0",
  "private": true,
  "main": "./lib/index.ts",
  "types": "./lib/index.ts",
  "exports": {
    ".": "./lib/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint .",
    "test": "bun test"
  }
}
```

---

## NixRails Scaffolding Engine Specification

### Engine Architecture

```
.Project-NixRails/
├── cli/                        # CLI interface
│   ├── index.ts                # Entry point
│   ├── commands/               # Command handlers
│   │   ├── new.ts              # Create new project
│   │   ├── add.ts              # Add app/package
│   │   └── init.ts             # Initialize in existing dir
│   └── prompts/                # Interactive prompts
├── templates/                  # Project templates
│   ├── base/                   # Base monorepo structure
│   ├── apps/                   # App templates
│   │   ├── web-react-ssr/      # React SSR app
│   │   ├── rust-api/           # Rust API service
│   │   └── bun-scripts/        # Scripts app
│   └── packages/               # Package templates
│       ├── configs/            # Shared configs
│       ├── utils/              # Utilities
│       ├── types/              # TypeScript types
│       └── components/         # React components
├── generators/                 # Code generators
│   ├── monorepo.ts             # Generate monorepo structure
│   ├── app.ts                  # Generate app
│   ├── package.ts              # Generate package
│   └── docker.ts               # Generate Docker configs
├── analyzers/                  # Pattern analyzers
│   ├── johto-analyzer.ts       # Analyze Pokemon patterns
│   └── arcturus-analyzer.ts    # Analyze Arcturus patterns
├── configs/                    # Configuration presets
│   ├── mise/                   # mise.toml presets
│   ├── turbo/                  # turbo.json presets
│   ├── typescript/             # tsconfig presets
│   └── docker/                 # Dockerfile presets
└── package.json                # Engine package
```

### Project Archetypes

The engine should support multiple project types:

#### 1. **Full-Stack Monorepo** (Pokemon-style)
- React SSR frontend (Bun)
- Rust backend service(s)
- Shared TypeScript packages
- Database support (PostgreSQL, Neo4j)
- Docker orchestration
- mise tool management

**Generated Structure:**
```
new-project/
├── apps/
│   ├── web/              # React SSR
│   └── api/              # Rust API
├── packages/
│   ├── @configs/
│   ├── @database/
│   ├── @utils/
│   └── @types/
├── docker/
├── .mise.toml
├── turbo.json
└── package.json
```

#### 2. **Frontend-Focused Monorepo** (Arcturus-style)
- React SSR with prerendering
- Design system packages
- Webpack build configuration
- Component library
- GitHub Actions CI/CD

**Generated Structure:**
```
new-project/
├── apps/
│   └── web/              # React SSR
├── packages/
│   ├── components/       # Component library
│   ├── tokens/           # Design tokens
│   ├── css/              # CSS utilities
│   ├── types/            # TypeScript types
│   └── config/           # Shared configs
├── .github/workflows/
├── .mise.toml
├── turbo.json
└── package.json
```

#### 3. **Minimal Monorepo** (Starter)
- Single React app
- Essential shared packages
- Basic configuration

**Generated Structure:**
```
new-project/
├── apps/
│   └── web/              # React app
├── packages/
│   ├── @configs/
│   └── @utils/
├── .mise.toml
├── turbo.json
└── package.json
```

#### 4. **Backend-Heavy Monorepo**
- Multiple Rust services
- Shared Rust crates
- TypeScript scripts
- Database support

**Generated Structure:**
```
new-project/
├── apps/
│   ├── api/              # Rust API
│   ├── worker/           # Rust worker
│   └── scripts/          # TS scripts
├── packages/
│   └── @configs/
├── crates/               # Shared Rust crates
├── docker/
├── .mise.toml
├── turbo.json
└── package.json
```

### CLI Interface

**Commands:**

```bash
# Create new project
nixrails new <project-name> [--type full-stack|frontend|minimal|backend]

# Initialize in existing directory
nixrails init [--type full-stack|frontend|minimal|backend]

# Add new app
nixrails add app <app-name> --type web|api|scripts

# Add new package
nixrails add package <package-name> --type utils|configs|components|types

# Add Docker support
nixrails add docker [--services postgres|neo4j|redis]

# Add CI/CD
nixrails add ci --provider github|gitlab

# Generate component (for React apps)
nixrails generate component <component-name> --app <app-name>

# Generate API route (for Rust apps)
nixrails generate route <route-name> --app <app-name>
```

**Interactive Prompts:**

When running `nixrails new` without arguments:
1. Project name?
2. Project type? (full-stack, frontend, minimal, backend)
3. Include Docker? (yes/no)
4. Include CI/CD? (github, gitlab, none)
5. Bun version? (1.3.5, 1.3.2, latest)
6. Node version? (24.6.0, latest)
7. Include Rust? (yes/no, version)
8. Project scope? (@project-name)

### Template System

**Template Variables:**

Templates should support variable substitution:
- `{{PROJECT_NAME}}` - Project name
- `{{PROJECT_SCOPE}}` - NPM scope (@project)
- `{{APP_NAME}}` - App name
- `{{PACKAGE_NAME}}` - Package name
- `{{BUN_VERSION}}` - Bun version
- `{{NODE_VERSION}}` - Node version
- `{{RUST_VERSION}}` - Rust version
- `{{YEAR}}` - Current year
- `{{DATE}}` - Current date

**Example Template (package.json):**
```json
{
  "name": "{{PROJECT_SCOPE}}/root",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "packageManager": "bun@{{BUN_VERSION}}"
}
```

### Configuration Presets

**mise.toml Presets:**

1. **Full-Stack Preset** (TypeScript + Rust)
```toml
[tools]
bun = { version = "{{BUN_VERSION}}", os = ["linux", "macos"] }
node = { version = "{{NODE_VERSION}}", os = ["linux", "macos"] }
rust = { version = "{{RUST_VERSION}}", os = ["linux", "macos"] }
```

2. **Frontend Preset** (TypeScript only)
```toml
[tools]
bun = { version = "{{BUN_VERSION}}", os = ["linux", "macos"] }
node = { version = "{{NODE_VERSION}}", os = ["linux", "macos"] }
```

3. **Backend Preset** (Rust + TypeScript)
```toml
[tools]
bun = { version = "{{BUN_VERSION}}", os = ["linux", "macos"] }
node = { version = "{{NODE_VERSION}}", os = ["linux", "macos"] }
rust = { version = "{{RUST_VERSION}}", os = ["linux", "macos"] }
```

**turbo.json Presets:**

Standard Turborepo configuration with optimized caching:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**", "target/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

### Pattern Analysis Engine

The scaffolding engine should analyze reference projects to extract:

1. **Directory Structure Patterns**
   - App organization
   - Package organization
   - Config file locations

2. **Dependency Patterns**
   - Common dependencies
   - Version specifications
   - Workspace dependencies

3. **Script Patterns**
   - Standard npm scripts
   - mise tasks
   - Build pipelines

4. **Configuration Patterns**
   - TypeScript configurations
   - ESLint/Prettier settings
   - Docker configurations

**Analyzer Interface:**
```typescript
interface ProjectAnalyzer {
  analyzeStructure(): DirectoryStructure;
  analyzeDependencies(): DependencyMap;
  analyzeScripts(): ScriptMap;
  analyzeConfigs(): ConfigMap;
  extractPatterns(): PatternSet;
}
```

### Generator System

**Generator Interface:**
```typescript
interface Generator {
  generate(options: GeneratorOptions): Promise<void>;
  validate(options: GeneratorOptions): ValidationResult;
  preview(options: GeneratorOptions): PreviewResult;
}

interface MonorepoGenerator extends Generator {
  generateBaseStructure(): void;
  generateConfigs(): void;
  generateWorkspaces(): void;
  generateDocumentation(): void;
}

interface AppGenerator extends Generator {
  generateAppStructure(): void;
  generateAppConfigs(): void;
  generateSourceFiles(): void;
}

interface PackageGenerator extends Generator {
  generatePackageStructure(): void;
  generatePackageConfigs(): void;
  generateExports(): void;
}
```

### File System Operations

**Core Operations:**
- Copy template files
- Generate from templates
- Variable substitution
- File permissions
- Symbolic links (if needed)

**Safety Features:**
- Dry-run mode
- Overwrite protection
- Backup creation
- Rollback capability

### Post-Generation Steps

After generating a project, the engine should:

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "chore: initial commit from nixrails"
   ```

2. **Install Dependencies**
   ```bash
   bun install --frozen-lockfile
   ```

3. **Run Initial Build** (optional)
   ```bash
   bun run build
   ```

4. **Initialize Development Environment**
   ```bash
   mise install
   ```

5. **Display Next Steps**
   ```
   ✓ Project created successfully!

   Next steps:
   1. cd new-project
   2. mise run dev
   3. Open http://localhost:3000

   Available commands:
   - mise run dev     # Start development
   - mise run build   # Build for production
   - mise run test    # Run tests
   - mise run lint    # Lint code
   ```

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Objectives:**
- Set up NixRails project structure
- Implement basic CLI interface
- Create template system
- Build file generation engine

**Deliverables:**
- [ ] Project structure scaffolding
- [ ] CLI with basic commands (`new`, `init`)
- [ ] Template parser and variable substitution
- [ ] File system utilities

**Tasks:**
1. Initialize NixRails monorepo
2. Set up CLI framework (e.g., Commander.js, Cliffy)
3. Implement template parser
4. Create file generation utilities
5. Add error handling and validation

### Phase 2: Template Creation (Week 3-4)

**Objectives:**
- Create base monorepo templates
- Build app templates (web, API, scripts)
- Build package templates
- Create configuration presets

**Deliverables:**
- [ ] Base monorepo template
- [ ] React SSR app template
- [ ] Rust API app template
- [ ] Shared package templates
- [ ] Configuration presets (mise, turbo, TypeScript)

**Tasks:**
1. Extract common patterns from Pokemon project
2. Extract common patterns from Arcturus project
3. Create minimal base template
4. Create full-stack template
5. Create frontend-focused template
6. Create backend-heavy template

### Phase 3: Pattern Analysis (Week 5-6)

**Objectives:**
- Build analyzers for reference projects
- Extract patterns programmatically
- Generate dynamic templates

**Deliverables:**
- [ ] Pokemon project analyzer
- [ ] Arcturus project analyzer
- [ ] Pattern extraction engine
- [ ] Dynamic template generation

**Tasks:**
1. Implement directory structure analyzer
2. Implement dependency analyzer
3. Implement configuration analyzer
4. Build pattern extraction algorithms
5. Create dynamic template system

### Phase 4: Advanced Features (Week 7-8)

**Objectives:**
- Add Docker support
- Add CI/CD support
- Implement component generators
- Add validation and testing

**Deliverables:**
- [ ] Docker configuration generator
- [ ] GitHub Actions generator
- [ ] Component generator
- [ ] Route generator
- [ ] Validation system
- [ ] Test suite

**Tasks:**
1. Create Docker template system
2. Create CI/CD templates
3. Implement component generator
4. Implement route generator
5. Add comprehensive validation
6. Write integration tests

### Phase 5: Polish & Documentation (Week 9-10)

**Objectives:**
- Improve user experience
- Add comprehensive documentation
- Create example projects
- Prepare for release

**Deliverables:**
- [ ] Interactive prompts
- [ ] Comprehensive CLI help
- [ ] User documentation
- [ ] Developer documentation
- [ ] Example projects
- [ ] Release preparation

**Tasks:**
1. Enhance interactive prompts
2. Improve error messages
3. Write user guide
4. Write developer guide
5. Create example projects
6. Package for distribution

---

## Technical Requirements

### Technology Stack

**Core Technologies:**
- **Runtime**: Bun 1.3+
- **Language**: TypeScript (strict mode)
- **CLI Framework**: Commander.js or Cliffy
- **Templating**: Handlebars or custom parser
- **File System**: Node.js fs module with Bun optimizations
- **Testing**: Bun test runner
- **Validation**: Zod for schema validation

**Dependencies:**
```json
{
  "dependencies": {
    "commander": "^11.0.0",
    "handlebars": "^4.7.8",
    "chalk": "^5.3.0",
    "ora": "^7.0.1",
    "inquirer": "^9.2.11",
    "fs-extra": "^11.1.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "turbo": "^2.0.0"
  }
}
```

### Code Quality Standards

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Testing Requirements:**
- Unit tests for all generators
- Integration tests for CLI commands
- Template validation tests
- End-to-end generation tests
- Minimum 80% code coverage

**Documentation Requirements:**
- JSDoc comments for all public APIs
- README with usage examples
- CLI help text for all commands
- Architecture documentation
- Contributing guide

### Performance Requirements

- Project generation: < 10 seconds for minimal template
- Project generation: < 30 seconds for full-stack template
- Template parsing: < 1 second
- Pattern analysis: < 5 seconds per project
- Memory usage: < 500MB during generation

### Security Considerations

- Validate all user inputs
- Sanitize file paths
- Prevent directory traversal
- Secure template variable interpolation
- Safe file permissions
- No execution of arbitrary code

---

## Testing Strategy

### Unit Tests

Test individual components:
- Template parser
- Variable substitution
- File generators
- Validators
- Analyzers

**Example:**
```typescript
describe('TemplateParser', () => {
  it('should substitute variables correctly', () => {
    const template = '{{PROJECT_NAME}}/{{APP_NAME}}';
    const vars = { PROJECT_NAME: 'test', APP_NAME: 'web' };
    expect(parser.parse(template, vars)).toBe('test/web');
  });
});
```

### Integration Tests

Test CLI commands end-to-end:
- `nixrails new` creates valid project
- `nixrails add app` creates valid app
- `nixrails add package` creates valid package
- Generated projects build successfully
- Generated projects pass linting

**Example:**
```typescript
describe('CLI: nixrails new', () => {
  it('should create a minimal project', async () => {
    await cli.run(['new', 'test-project', '--type', 'minimal']);
    expect(fs.existsSync('test-project')).toBe(true);
    expect(fs.existsSync('test-project/package.json')).toBe(true);
    expect(fs.existsSync('test-project/.mise.toml')).toBe(true);
  });
});
```

### Template Tests

Validate templates:
- All variables are defined
- Generated files are syntactically valid
- No broken references
- Proper file permissions

### End-to-End Tests

Test complete workflows:
1. Generate project
2. Install dependencies
3. Build project
4. Run tests
5. Start development server

---

## Success Criteria

The NixRails Scaffolding Engine will be considered successful when:

### Functionality Criteria

- [ ] Can generate all four project archetypes (full-stack, frontend, minimal, backend)
- [ ] Generated projects build without errors
- [ ] Generated projects pass all linting
- [ ] Can add apps and packages to existing projects
- [ ] Can generate Docker configurations
- [ ] Can generate CI/CD configurations
- [ ] Interactive prompts work correctly
- [ ] CLI help is comprehensive and accurate

### Quality Criteria

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage > 80%
- [ ] All TypeScript strict mode checks pass
- [ ] No runtime errors in normal usage
- [ ] Proper error handling and user feedback
- [ ] Documentation is complete and accurate

### User Experience Criteria

- [ ] Clear and helpful error messages
- [ ] Intuitive command structure
- [ ] Sensible defaults
- [ ] Quick generation times
- [ ] Easy to understand generated code
- [ ] Follows best practices from reference projects

### Consistency Criteria

- [ ] Generated projects match reference project patterns
- [ ] Consistent file structure across archetypes
- [ ] Consistent naming conventions
- [ ] Consistent configuration formats
- [ ] Consistent tooling versions

---

## Future Enhancements

### Phase 6+: Advanced Features

1. **Plugin System**
   - Allow community-contributed templates
   - Custom generators
   - Middleware for generation process

2. **Project Updates**
   - Update existing projects to new patterns
   - Migrate between archetypes
   - Upgrade dependencies

3. **Interactive Dashboard**
   - Web UI for project generation
   - Visual project structure editor
   - Real-time preview

4. **AI-Powered Analysis**
   - Automatic pattern detection
   - Suggest optimizations
   - Generate custom templates

5. **Additional Archetypes**
   - Mobile app (React Native)
   - CLI tool
   - Library/SDK
   - Microservices

6. **Framework Support**
   - Next.js apps
   - Remix apps
   - SvelteKit apps
   - Vue/Nuxt apps

7. **Advanced Docker**
   - Kubernetes configs
   - Docker Swarm configs
   - Multi-stage build optimization

8. **Cloud Deployment**
   - AWS deployment configs
   - Vercel deployment
   - Railway deployment
   - Fly.io deployment

---

## Appendix

### A. Reference Project Comparison Matrix

| Feature | Pokemon | Arcturus-JR | NixRails Target |
|---------|---------|-------------|-----------------|
| **Runtime** | Bun 1.3.5 | Bun 1.3.2 | Configurable (1.3.2+) |
| **Node Version** | 24.6.0 | 24.6.0 | 24.6.0 |
| **Turborepo** | 2.3.0 | 2.6.1 | Latest stable |
| **React** | 19 SSR | 19 SSR + Prerender | Configurable |
| **Backend** | Rust (Actix) | None | Optional |
| **Database** | PostgreSQL, Neo4j | None | Optional |
| **Docker** | Multi-service | Web only | Configurable |
| **CI/CD** | None visible | GitHub Actions | Configurable |
| **Testing** | Bun test | Bun test | Bun test |
| **Package Scope** | @pokemon/* | @arcjr/*, void-* | Configurable |

### B. File Structure Examples

**Minimal Monorepo:**
```
new-project/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── public/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── @configs/
│   │   ├── typescript/
│   │   │   └── base.tsconfig.json
│   │   └── package.json
│   └── @utils/
│       ├── lib/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── .mise.toml
├── turbo.json
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example
└── README.md
```

**Full-Stack Monorepo:**
```
new-project/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── public/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.rs
│   │   │   ├── routes/
│   │   │   └── models/
│   │   ├── Cargo.toml
│   │   └── Dockerfile
│   └── scripts/
│       ├── bin/
│       ├── lib/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── @configs/
│   ├── @database/
│   ├── @utils/
│   └── @types/
├── docker/
│   └── database/
│       └── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .mise.toml
├── turbo.json
├── package.json
├── docker-compose.yml
├── tsconfig.json
├── .gitignore
├── .env.example
└── README.md
```

### C. Template Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{{PROJECT_NAME}}` | Project name | `my-awesome-app` |
| `{{PROJECT_SCOPE}}` | NPM scope | `@company` |
| `{{APP_NAME}}` | App name | `web`, `api` |
| `{{PACKAGE_NAME}}` | Package name | `utils`, `configs` |
| `{{BUN_VERSION}}` | Bun version | `1.3.5` |
| `{{NODE_VERSION}}` | Node version | `24.6.0` |
| `{{RUST_VERSION}}` | Rust version | `1.92.0` |
| `{{TURBO_VERSION}}` | Turborepo version | `2.3.0` |
| `{{TYPESCRIPT_VERSION}}` | TypeScript version | `5.5.4` |
| `{{YEAR}}` | Current year | `2026` |
| `{{DATE}}` | Current date | `2026-01-05` |
| `{{AUTHOR}}` | Author name | From git config |
| `{{EMAIL}}` | Author email | From git config |

### D. CLI Command Reference

```bash
# Project Creation
nixrails new <project-name> [options]
  --type <type>          # Project type: full-stack, frontend, minimal, backend
  --scope <scope>        # NPM scope (e.g., @company)
  --bun <version>        # Bun version
  --node <version>       # Node version
  --rust <version>       # Rust version (for full-stack/backend)
  --no-docker            # Skip Docker configuration
  --no-ci                # Skip CI/CD configuration
  --no-install           # Skip dependency installation
  --no-git               # Skip git initialization

# Project Initialization (in existing directory)
nixrails init [options]
  --type <type>          # Project type
  --force                # Overwrite existing files

# Add Application
nixrails add app <app-name> [options]
  --type <type>          # App type: web, api, scripts
  --framework <fw>       # Framework: react, next, remix (for web)
  --lang <lang>          # Language: typescript, rust (for api)

# Add Package
nixrails add package <package-name> [options]
  --type <type>          # Package type: utils, configs, types, components
  --scope <scope>        # Package scope

# Add Infrastructure
nixrails add docker [options]
  --services <services>  # Comma-separated: postgres,redis,neo4j

nixrails add ci [options]
  --provider <provider>  # CI provider: github, gitlab

# Code Generation
nixrails generate component <name> [options]
  --app <app-name>       # Target app
  --story                # Include Storybook story
  --test                 # Include tests

nixrails generate route <name> [options]
  --app <app-name>       # Target app
  --method <method>      # HTTP method: get, post, put, delete

# Utility Commands
nixrails info              # Display project information
nixrails validate          # Validate project structure
nixrails upgrade           # Upgrade project to latest patterns
nixrails --version         # Display version
nixrails --help            # Display help
```

### E. Configuration Schema

**nixrails.config.json** (Optional project-specific config):
```json
{
  "version": "1.0.0",
  "type": "full-stack",
  "scope": "@project",
  "apps": [
    {
      "name": "web",
      "type": "web",
      "framework": "react"
    },
    {
      "name": "api",
      "type": "api",
      "language": "rust"
    }
  ],
  "packages": [
    {
      "name": "@configs",
      "type": "configs"
    },
    {
      "name": "@utils",
      "type": "utils"
    }
  ],
  "tools": {
    "bun": "1.3.5",
    "node": "24.6.0",
    "rust": "1.92.0"
  },
  "features": {
    "docker": true,
    "ci": "github"
  }
}
```

---

## Conclusion

The NixRails Scaffolding Engine will provide a powerful, opinionated way to generate production-ready Bun Turborepo workspaces based on proven patterns from Project-Johto and Project-Arcturus. By standardizing project structure, tooling, and configuration, NixRails will accelerate development and ensure consistency across projects.

The engine's modular architecture supports multiple project archetypes while maintaining flexibility for future enhancements. The comprehensive template system, combined with pattern analysis capabilities, ensures that generated projects follow best practices and remain maintainable over time.

**Next Steps:**
1. Review and approve this specification
2. Begin Phase 1 implementation
3. Create initial templates based on reference projects
4. Develop MVP with basic project generation
5. Iterate based on user feedback

---

**Document Version History:**
- v1.0.0 (2026-01-05): Initial specification created
