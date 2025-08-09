'use server';

import { auth } from '@/auth';
import { UserRole } from '@/db/schema';
import { Session } from 'next-auth';
import { forbidden, unauthorized } from 'next/navigation';

type Role = UserRole | 'all' | 'auth';

export default async function withAuth<T>(
  fn: (session?: Session | null) => Promise<T>,
  roles: Role[] = [],
  accessCheck?: (session: Session) => Promise<boolean>
) {
  const session = await auth();
  const method = fn.toString();

  const callFnWithAccessCheck = async (session?: Session | null) => {
    if (accessCheck && session?.user) {
      const isAuthorized = await accessCheck(session);
      if (!isAuthorized && session.user.role !== 'admin') {
        console.error(
          'Custom Auth Check',
          {
            role: session.user.role,
            userId: session.user.id,
            expectedRoles: ['admin', ...roles],
          },
          method
        );
        return forbidden();
      }
    }
    return fn(session);
  };

  if (roles.length === 1 && roles.includes('all')) {
    return callFnWithAccessCheck(session);
  }

  if (!session?.user) {
    console.error('No session', method);
    return unauthorized();
  }

  if (roles.includes('auth') && session?.user) {
    return callFnWithAccessCheck(session);
  }

  if (!['admin', ...roles].includes(session.user.role as Role)) {
    console.error('Permission Error', method, {
      currentRole: session.user.role,
      expectedRoles: ['admin', ...roles],
    });
    return forbidden();
  }

  return callFnWithAccessCheck(session);
}
