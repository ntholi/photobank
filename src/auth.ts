import { db } from '@/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';
import { accounts, sessions, users, verificationTokens } from './db/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
});
