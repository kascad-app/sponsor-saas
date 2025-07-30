# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kascad Sponsor is a Next.js 15 application designed to help sponsors find and connect with riders for marketing campaigns. The app provides a dashboard for sponsors to search, view, and manage their favorite riders.

## Development Commands

```bash
# Development server with turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture Overview

### App Structure
- **Next.js App Router**: Uses the new App Router with route groups
- **Route Groups**: 
  - `(auth)`: Authentication pages (login, register)
  - `(marketing)`: Marketing/public pages
  - `(saas)`: Protected sponsor dashboard pages
- **Standalone Output**: Configured for containerized deployment

### Key Directories

- `src/components/`: Reusable UI components
  - `layouts/`: Layout components including sidebar navigation
  - `screens/`: Page-specific screen components
  - `ui/`: shadcn/ui components
  - `utils/`: Utility components
- `src/contexts/`: React contexts (favorites management)
- `src/entities/`: Domain-specific logic and hooks
- `src/lib/`: Core libraries and utilities
  - `requester/`: HTTP request handling
  - `swr/`: SWR data fetching utilities
- `src/shared/`: Shared constants and utilities
- `src/widget/`: Feature widgets
- `src/widgets/`: Complex components

### State Management

- **SWR**: Data fetching and caching
- **React Context**: Favorites management with localStorage persistence
- **Local Storage**: Persistent favorites storage

### Authentication

- Cookie-based authentication with `credentials: "include"`
- Authentication hooks in `src/entities/authentication/`
- Protected routes in `(saas)` route group

### Data Fetching

- **Primary**: SWR for server state management
- **HTTP Client**: Custom requester utility with auth support
- **Types**: Shared types from `@kascad-app/shared-types` package

### UI Components

- **shadcn/ui**: Component library
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **next-themes**: Theme management
- **Sonner**: Toast notifications

### Key Features

1. **Rider Search**: Search and filter riders
2. **Favorites**: Add/remove riders from favorites with persistence
3. **Dashboard**: Overview of rider data
4. **Rider Details**: Detailed rider information pages
5. **Theme Support**: Light/dark mode switching

### Navigation Structure

Main navigation includes:
- Dashboard (`/dashboard`)
- Scouting (`/search`)
- My contracts (`/contracts`)
- Favorites (`/favorites`)

### Docker Support

- Multi-stage Docker build
- Standalone Next.js output
- docker-compose.yml for local development

## TypeScript Configuration

- Strict TypeScript enabled
- Path alias `@/*` points to project root
- ES2017 target with ESNext modules