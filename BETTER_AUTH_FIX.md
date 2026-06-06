# Better Auth Dependency Conflict Resolution

## Problem

The project was failing to build with the following error:

```
Export DEFAULT_MIGRATION_LOCK_TABLE doesn't exist in target module
Export DEFAULT_MIGRATION_TABLE doesn't exist in target module
```

This occurred because:
- `better-auth@1.6.14` includes `@better-auth/kysely-adapter@1.6.14` as a sub-dependency
- The Kysely adapter was built for `kysely@0.28.x`
- The dependency tree resolved to `kysely@0.29.2`, which has breaking changes
- Kysely 0.29 removed the `DEFAULT_MIGRATION_LOCK_TABLE` and `DEFAULT_MIGRATION_TABLE` exports

## Solution

Since the project uses **Drizzle ORM with `pg`** (not Kysely), the Kysely adapter is not actually needed at runtime. The fix involved:

### 1. Added pnpm Override

Updated `package.json` to use `pnpm.overrides` to force a compatible Kysely version:

```json
{
  "pnpm": {
    "overrides": {
      "kysely": "0.28.17"
    }
  }
}
```

### 2. Regenerated Lock File

Ran `pnpm install --no-frozen-lockfile` to regenerate the `pnpm-lock.yaml` with the override applied.

### 3. Verified Build

The build now completes successfully:
- ✓ Compiled successfully in 7.3s
- ✓ All routes generated without errors
- ✓ No Kysely export errors

## Dependency Versions

- **better-auth**: ^1.6.14
- **drizzle-orm**: ^0.45.2
- **pg**: ^8.21.0
- **kysely**: 0.28.17 (pinned via override)

## Why This Works

1. The `@better-auth/kysely-adapter` is bundled but never executed (we use `pg` directly)
2. By pinning Kysely to 0.28.17, the bundled code is compatible with its imports
3. At runtime, only the `pg` adapter is used, so Kysely compatibility is not an issue

## Deployment Notes

When deploying to production (Vercel, etc.), ensure:
- Environment variables are set: `BETTER_AUTH_SECRET`, `DATABASE_URL`, `NEON_AUTH_COOKIE_SECRET`
- The build runs with the updated `pnpm-lock.yaml`
- No manual Kysely configuration is needed

## Testing

- ✓ Development server starts without errors
- ✓ Home page loads correctly
- ✓ Advisor page loads with chatbot and lead form
- ✓ Production build completes successfully

All pages and API routes are functional and ready for deployment.
