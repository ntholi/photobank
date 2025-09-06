'use server';

import { auth } from '@/auth';
import { UserRole } from '@/db/schema';
import { Session } from 'next-auth';
import { forbidden, unauthorized } from 'next/navigation';

type Role = UserRole | 'all' | 'auth';
type AccessCheckFunction = (session: Session) => Promise<boolean>;

/**
 * Higher-order function for wrapping server functions with authentication and authorization.
 * Supports two modes:
 * 1. Role-based authorization: Pass an array of required roles
 * 2. Custom access check: Pass a function that receives the session and returns a boolean
 */

// Overload for role-based authorization
export default async function withAuth<T>(
  fn: (session?: Session | null) => Promise<T>,
  roles: Role[],
): Promise<T>;

// Overload for custom access check
export default async function withAuth<T>(
  fn: (session?: Session | null) => Promise<T>,
  accessCheck: AccessCheckFunction,
): Promise<T>;

// Implementation
export default async function withAuth<T>(
  fn: (session?: Session | null) => Promise<T>,
  rolesOrAccessCheck: Role[] | AccessCheckFunction,
): Promise<T> {
  const session = await auth();
  const functionName = fn.toString();

  // Determine if we're using role-based auth or custom access check
  const isRoleBased = Array.isArray(rolesOrAccessCheck);
  const roles = isRoleBased ? rolesOrAccessCheck : [];
  const accessCheck = isRoleBased ? null : rolesOrAccessCheck;

  try {
    // Handle 'all' role - allows any request (even unauthenticated)
    if (isRoleBased && roles.length === 1 && roles.includes('all')) {
      return await fn(session);
    }

    // Check if session exists for authenticated routes
    if (!session?.user) {
      logAuthError('No session found', functionName, { expectedAuth: true });
      return unauthorized();
    }

    // Handle 'auth' role - requires any authenticated user
    if (isRoleBased && roles.includes('auth')) {
      return await fn(session);
    }

    // Admin users always have access (unless using custom access check)
    const isAdmin = session.user.role === 'admin';

    if (isRoleBased && isAdmin) {
      return await fn(session);
    }

    // Role-based authorization
    if (isRoleBased) {
      const hasRequiredRole = roles.includes(session.user.role as Role);

      if (!hasRequiredRole) {
        logAuthError('Insufficient role permissions', functionName, {
          currentRole: session.user.role,
          requiredRoles: roles,
          userId: session.user.id,
        });
        return forbidden();
      }

      return await fn(session);
    }

    // Custom access check authorization
    if (accessCheck) {
      let hasAccess = false;

      try {
        hasAccess = await accessCheck(session);
      } catch (error) {
        logAuthError('Access check function threw an error', functionName, {
          userId: session.user.id,
          userRole: session.user.role,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        return forbidden();
      }

      // Admin bypass for custom access checks
      if (!hasAccess && !isAdmin) {
        logAuthError('Custom access check failed', functionName, {
          userId: session.user.id,
          userRole: session.user.role,
        });
        return forbidden();
      }

      return await fn(session);
    }

    // This should never be reached due to TypeScript overloads
    logAuthError('Invalid authorization configuration', functionName, {
      rolesOrAccessCheck: typeof rolesOrAccessCheck,
    });
    return forbidden();
  } catch (error) {
    logAuthError('Auth Error', functionName, {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: session?.user?.id,
    });
    throw error;
  }
}

/**
 * Helper function for consistent error logging
 */
function logAuthError(
  message: string,
  functionName: string,
  details: Record<string, unknown>,
): void {
  console.error(`[withAuth] ${message}`, {
    function: functionName,
    timestamp: new Date().toISOString(),
    ...details,
  });
}
