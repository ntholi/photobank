import { Role } from '@prisma/client';
import { User } from 'next-auth';

export function canUpload(user: User | undefined) {
  const validRoles: Role[] = ['contributor', 'moderator', 'admin'];
  return user?.role && validRoles.includes(user.role);
}
