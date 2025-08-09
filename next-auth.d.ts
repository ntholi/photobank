import { UserRole } from '@/db/schema';
import { User as DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }
}
