import { DefaultSession, DefaultUser } from 'next-auth';
import { Role } from '@prisma/client';

interface IUser extends DefaultUser {
  role?: Role;
  id: string;
}

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
