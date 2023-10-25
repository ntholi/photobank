import prisma from '@/lib/db';
import { Account, AuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import { auth } from '@/lib/config/firebase';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { adminAuth } from '@/lib/config/firebase-admin';
import { saveUserToDB } from '../../users/userService';

export const authOptions = {
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  // debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Enter email and password');
        }
        const firebaseCredentials = await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password,
        );
        const user = await prisma.user.findUnique({
          where: { id: firebaseCredentials.user.uid },
        });

        if (!user) {
          throw new Error('User not found');
        }
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        if (account?.provider === 'google') {
          const credential = GoogleAuthProvider.credential(account.id_token);
          const userCredential = await signInWithCredential(auth, credential);
          await saveUserToDB(userCredential.user);
        }
        return true;
      } else {
        return false;
      }
    },

    async jwt({ token, account, profile, user }) {
      if (user && account) {
        const uid = await getFirebaseUserId(user, account);
        const dbUser = await prisma.user.findUnique({
          where: { id: uid },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.username = dbUser.username;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
} as AuthOptions;

async function getFirebaseUserId(user: User, account: Account | null) {
  let firebaseUser;
  if (account?.provider === 'google') {
    firebaseUser = await adminAuth.getUserByProviderUid(
      'google.com',
      account.providerAccountId,
    );
  } else {
    firebaseUser = await adminAuth.getUserByEmail(user.email || '');
  }
  return firebaseUser.uid;
}
