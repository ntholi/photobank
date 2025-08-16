# Photobank Web – AI Coding Instructions

These instructions govern automated code generation for the Photobank application (Next.js 15, TypeScript strict). Enforce architectural, security, and UI layer separation rules exactly as defined below.

## 1. Core Architecture

3-layer server pattern for every resource under `src/server/[resource]/`:

1. `actions.ts` server actions ( `'use server'` ) exported for UI
2. `service.ts` business logic wrapped by `serviceWrapper()` and gated by `withAuth()`
3. `repository.ts` data access extending `BaseRepository<Table, PrimaryKey>` and using Drizzle

Never bypass a service from the UI. Never put auth logic in repositories. Keep repositories pure data access. Add new resources only following this layout. Reuse existing helpers in `src/server/base`.

## 2. Database & Types

Technology: PostgreSQL via Drizzle ORM with snake_case casing.

- Schema: `src/db/schema.ts`
- Config: `drizzle.config.ts` (casing: 'snake_case')
- Prefer explicit column selection with `db.query.<table>.findMany({ columns: { ... } })`
- Derive types: `type Location = typeof locations.$inferSelect`
- Raw SQL (only when unavoidable): use snake_case column names. Example: `created_at`, not `createdAt`.
- Commands: `pnpm db:generate` (DDL snapshots), `pnpm db:migrate` (apply), `pnpm db:studio`

## 3. Authentication & Authorization

Auth: NextAuth (Google) + role permissions: `user`, `contributor`, `moderator`, `admin`.

- Always wrap service handlers with `withAuth(fn, roles?, accessCheck?)`
- Use the optional `accessCheck` for record-level ownership checks.
- Never trust client-provided role data; always read from session.

## 4. Frontend Layer Separation & UI Framework Rules

There are two distinct UI zones with strict framework isolation:

Zone A `(main)` directory: `src/app/(main)/**`

- UI library: HeroUI (formerly NextUI) only (`@heroui/*` packages)
- Do NOT import Mantine components here.
- Styling approach: combine HeroUI props + minimal Tailwind utility classes. Keep interface elegant, spacious, and minimal—avoid visual clutter and heavy borders. Favor subtle elevation (soft shadow or 1px border with opacity).
- Use existing provider in `(main)/providers.tsx` to configure HeroUI theme. Extend tokens there rather than inline theme hacks.

Zone B Dashboard: `src/app/dashboard/**`

- UI library: Mantine only.
- Do NOT import HeroUI components here.
- Maintain a structured, data-dense but readable dashboard aesthetic. Use spacing scale consistently; avoid arbitrary pixel values. Use `c="colorName"` prop for colors. Prefer semantic variants (filled, light, subtle) over custom CSS.

Shared / Cross-Zone Code:

- Put framework-agnostic primitives in `src/app/components` (pure logic, icons, simple wrappers without framework styling assumptions).
- A primitive must not import HeroUI or Mantine directly; if styling differs, create thin adapters in each zone.
- Never leak one zone's provider or theme tokens into the other.

Migration / Enforcement Notes:

- If adding a new component under `(main)`, choose a HeroUI equivalent before creating custom elements.
- If adding a dashboard table or form, use Mantine core components, Mantine Form helper, and existing patterns.

## 5. Frontend Patterns (Both Zones)

- Never create traditional API routes; always call server actions.
- Data fetching: TanStack Query for all remote/stateful server calls (no raw `useEffect` for fetching).
- Mutations: use `useMutation` and invalidate queries by key.
- Forms: prefer zod schemas; in Mantine zone use `@mantine/form` + `mantine-form-zod-resolver`, in HeroUI zone compose controlled components with zod validation utilities (keep logic co-located).
- List → detail layout: reuse `ListLayout` pattern where applicable (extend minimally, don't fork).
- Co-locate modals with the trigger component to avoid prop drilling.
- Progressive enhancement: components render quickly with skeleton/loading states derived from HeroUI or Mantine equivalents, not custom spinners unless necessary.

**Key Integrations:**

- Google Maps API for location autocomplete/details (see `locations/actions.ts`)
- AWS S3 for content storage (configured in `src/lib/aws.ts`)
- Content types: 'image' | 'video' with status workflow: 'draft' → 'pending' → 'published' | 'rejected' | 'archived'

## 6. Styling & Theming Principles

- Minimal, elegant, accessible. Favor spacing and typography over decorative chrome.
- Light & dark mode must both work; test contrast (WCAG AA) for text/background combinations.
- No inline hex values except for one-off algorithmic colors; prefer theme tokens.
- Avoid duplicating spacing constants; use framework spacing scale or Tailwind standard increments.
- Remove dead CSS—keep `globals.css` lean.

## 7. Code Quality & Conventions

- TypeScript strict; never use `any`.
- No extraneous `{ ' ' }` inserts in JSX.
- No comments in generated code (enforced by higher-level rule—docstrings only when explicitly requested by user).
- Keep components small and cohesive; extract hooks into `src/hooks` when reused across zones (hooks must remain framework-neutral or provide separate adapters).
- Enforce DRY: search before implementing similar functionality (reuse existing list, pagination, search components in `adease` subset when relevant).
- Prefer composition over deep prop drilling—wrap repeated patterns into primitives.

## 8. Performance & Accessibility

- Lazy-load non-critical, below-the-fold components with dynamic imports (SSR false only when needed).
- Memoize heavy lists/tables and avoid unnecessary re-renders (key by stable ids).
- Keyboard accessibility: all interactive elements must be reachable via Tab and have discernible labels.
- Provide `aria-*` attributes when semantics aren’t inherent.

## 9. Logging & Error Handling

- Use `serviceWrapper` for standardized error mapping.
- Do not swallow errors silently in UI; surface concise messages (no stack traces) using zone-specific notification system (Mantine notifications in dashboard, HeroUI Toast/Snippet equivalents in `(main)`).

## 10. Adding New Resources

Steps:

1. Create `src/server/<resource>/repository.ts` extending `BaseRepository`.
2. Add `service.ts` with `withAuth` specifying allowed roles.
3. Expose server actions in `actions.ts` only mapping validated inputs to service calls.
4. Create UI components in appropriate zone—never cross frameworks.
5. Add query keys constant for TanStack Query; centralize invalidation patterns.

## 11. Raw SQL Usage

Only when Drizzle can't express the query cleanly or for performance-critical aggregates. Always:

- Use snake_case column aliases.
- Parameterize inputs; never string interpolate user data.

## 12. Testing (Add When Implemented)

- Prefer Vitest for unit tests of pure logic (repositories, service functions without side effects).
- Mock external services (S3) with lightweight stubs.

## 13. Prohibited Patterns

- Mixing Mantine and HeroUI in a single file.
- Creating API route handlers for functionality available via server actions.
- Inline role or permission checks inside UI components—delegate to service or access-check function passed through action.
- Duplicating existing pagination, search, or list item components.

## 14. Commit & Dependency Hygiene

- Use pnpm only.
- Avoid adding UI libraries beyond HeroUI + Mantine; justify any new dependency with a clear gap.
- Keep bundle slim: avoid large icon packs; tree-shake by importing individual icons.

## 15. Development Commands

```bash
pnpm dev              # Development server with Turbopack
pnpm build            # Production build
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Apply migrations to database
pnpm db:studio        # Open Drizzle Studio
```

## 16. When Unsure

If framework choice is ambiguous, decide based on path: `(main)` -> HeroUI, `dashboard` -> Mantine. If a component must appear in both contexts, extract logic-only version and wrap separately per zone.

---

Summary Enforcement Snippets (not code, conceptual):

- `(main)/*` imports start with `@heroui/` or framework-agnostic libs
- `dashboard/*` imports start with `@mantine/`
- Shared primitives must not import either

Follow these instructions exactly to maintain architectural clarity and UI consistency.
