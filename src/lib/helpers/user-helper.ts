import { Role } from '@prisma/client';
import { User } from 'next-auth';

export function canUpload(user: User): boolean {
  const allowed: Role[] = ['admin', 'moderator', 'contributor'];
  if (user.role && allowed.includes(user.role)) {
    return true;
  }
  return false;
}
