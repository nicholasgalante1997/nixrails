# NixRails

A scaffolding engine for generating production-ready Bun Turborepo workspaces.

## Overview

NixRails generates opinionated monorepo templates based on proven patterns from:
- **Project-Johto/Pokemon**: Full-stack architecture (Bun + React SSR + databases)
- **Project-Arcturus**: Frontend-focused architecture (React 19 SSR + design systems)

## Features

- 🚀 **Bun-first**: Built for Bun runtime with optimal performance
- 📦 **Turborepo**: Monorepo orchestration with caching
- ⚛️ **React 19 SSR**: Modern server-side rendering
- 🗄️ **Database Support**: PostgreSQL, Neo4j, Sqlite3 integration
- 🐳 **Docker Ready**: Multi-stage builds and orchestration
- 🔧 **mise Integration**: Tool version management
- 📝 **TypeScript**: Strict type safety throughout

## Installation

```bash
# Install globally
bun install -g @nixrails/cli

# Or use directly with bunx
bunx @nixrails/cli new my-app
```

## Quick Start

```bash
# Create a new project
nixrails new my-app

# Navigate to project
cd my-app

# Start development
mise run dev
```

## Commands

```bash
# Create new project
nixrails new <name> [--type minimal|full-stack]

# Add components
nixrails add app <name> --type web
nixrails add package <name> --type utils|configs|types
nixrails add docker
nixrails add ci --provider github

# Utility commands
nixrails info        # Show project info
nixrails validate    # Validate project structure
```

## Project Archetypes

### Minimal
Basic monorepo with:
- Single React SSR web app
- Essential packages (@configs, @utils, @types)
- Development tooling

### Full-Stack
Comprehensive monorepo with:
- React SSR web app
- Database utilities (@database)
- Logger package
- Docker orchestration
- PostgreSQL/Neo4j support

## Development

```bash
# Clone repository
git clone <repo-url>
cd nix-rails

# Install dependencies
mise run install

# Build CLI
mise run build

# Test locally
cd packages/cli
bun link
nixrails new test-project
```

## Architecture

```
nix-rails/
├── packages/
│   └── cli/              # Main CLI package
│       ├── bin/          # Executable
│       ├── src/          # Source code
│       └── templates/    # Project templates
├── turbo.json            # Turborepo config
├── .mise.toml            # Tool management
└── package.json          # Workspace root
```

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines first.
