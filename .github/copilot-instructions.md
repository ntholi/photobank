```instructions
# Photobank Coding Instructions

Lesotho tourism photobank "Lehakoe" - Next.js 15, TypeScript strict, PostgreSQL/Drizzle.

## Architecture

**3-Layer Server Pattern** (`src/server/[resource]/`):
1. `actions.ts` - server actions (`'use server'`)
2. `service.ts` - business logic with `serviceWrapper()` + `withAuth()`
3. `repository.ts` - data access extending `BaseRepository<Table, PrimaryKey>`

Never bypass services from UI. Keep repositories pure data access.

## Database
PostgreSQL + Drizzle ORM (snake_case). Schema: `src/db/schema.ts`
- Use explicit column selection: `db.query.<table>.findMany({ columns: {...} })`
- Types: `type Location = typeof locations.$inferSelect`
- Raw SQL only when necessary: use `created_at` not `createdAt`

## Auth
NextAuth (Google) + roles: `user`, `contributor`, `moderator`, `admin`
- Wrap services: `withAuth(fn, roles?, accessCheck?)`
- Never trust client role data

## UI Framework Isolation

**Zone A - `(main)`**: HeroUI only (`@heroui/*`)
- Elegant, minimal styling with HeroUI props + minimal Tailwind
- Use `(main)/providers.tsx` for theming

**Zone B - `dashboard`**: Mantine only
- Data-dense, structured dashboard aesthetic
- Use native Mantine properties, avoid `style` prop

**Shared**: Framework-agnostic primitives in `src/app/components`

## Frontend Patterns
- Server actions only (no API routes)
- Prefer Server components for data fetching, or use TanStack Query in client components
- Mutations: `useMutation` + query invalidation
- Forms: Zod schemas + `@mantine/form` (dashboard) or controlled components (main)
- Co-locate modals with triggers

## Integrations
- Google Maps API (location autocomplete)
- AWS S3 (content storage)
- Content workflow: `draft` → `pending` → `published`/`rejected`/`archived`

## Code Standards
- TypeScript strict, no `any`
- No `{' '}` in JSX
- Small components, extract reusable hooks to `src/hooks`
- Minimal, accessible styling (light/dark mode)
- Use theme tokens, not inline hex

## New Resources
1. `repository.ts` extending `BaseRepository`
2. `service.ts` with `withAuth`
3. `actions.ts` mapping inputs to services
4. UI in appropriate zone
5. TanStack Query keys

## Prohibited
- Mixing Mantine + HeroUI
- API routes for server action functionality
- UI permission checks (delegate to services)

**Commands**: `pnpm dev`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`

**Zone routing**: `(main)` → HeroUI, `dashboard` → Mantine
```
