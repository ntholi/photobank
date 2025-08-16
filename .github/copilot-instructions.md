# Limkokwing Registry Web - AI Coding Instructions

## Core Architecture

This is a **Limkokwing University Registry Management System** built with Next.js 15, featuring a strict 3-layer server architecture and role-based access control.

### Server Architecture Pattern

All server code follows this exact structure in `src/server/[resource]/`:

1. **`actions.ts`** - Server actions for client consumption (uses `'use server'`)
2. **`service.ts`** - Business logic with authentication via `withAuth()`, wrapped with `serviceWrapper()`
3. **`repository.ts`** - Database operations extending `BaseRepository<Table, PrimaryKey>`

Example: `src/server/students/` demonstrates this pattern perfectly.

### Database & Types

- **Turso SQLite** via Drizzle ORM with schema in `src/db/schema.ts`
- Use `db.query` API for complex queries, select only needed columns
- Define types: `type Student = typeof students.$inferSelect;`
- Database commands: `pnpm db:push`, `pnpm db:generate`, `pnpm db:migrate`

### Authentication & Authorization

- NextAuth with Google OAuth, role-based permissions: `admin`, `registry`, `finance`, `academic`, `student`
- `withAuth(fn, roles, accessCheck?)` enforces permissions in services
- User-school relationships via `userSchools` junction table

## Development Guidelines

### Package Management & Build

- **Use pnpm exclusively** - never npm/yarn
- Dev server: `pnpm dev` (with Turbopack)
- Testing: `pnpm test` (Vitest)

### Frontend Patterns

- **Never use API routes** - call server actions directly via `actions.ts`
- **TanStack Query** for all data fetching, avoid useEffect
- **List-detail layout**: Use `ListLayout` component with responsive mobile support
- **Co-locate modals** with their triggers to avoid prop drilling
- **Self-contained components** - extract logic, minimize prop drilling

### UI Framework (Mantine v8)

- Dark mode optimized with light mode support
- Use predefined colors: `c="colorName"`
- Size values: `'4rem'` not `{rem(4)}`
- Responsive design with `useMediaQuery('(max-width: 768px)')`

### Code Quality

- TypeScript strict mode - avoid `any` completely
- No comments in generated code
- Self-contained components in parent directories
- Shared components in `src/app/components`
- Remove duplicate code, follow DRY principles
