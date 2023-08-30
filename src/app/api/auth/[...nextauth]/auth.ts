import { prisma } from '@/lib/db';
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
                const { user } = await signInWithEmailAndPassword(
                    auth,
                    credentials.email,
                    credentials.password,
                );
                return {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    image: user.photoURL,
                } as any;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const isAllowedToSignIn = true;
            if (isAllowedToSignIn) {
                if (account?.provider === 'google') {
                    const credential = GoogleAuthProvider.credential(
                        account.id_token,
                    );
                    const userCredential = await signInWithCredential(
                        auth,
                        credential,
                    );
                    await prisma.user.upsert({
                        create: {
                            id: userCredential.user.uid,
                        },
                        update: {},
                        where: {
                            id: userCredential.user.uid,
                        },
                    });
                }
                return true;
            } else {
                return false;
            }
        },

        async jwt({ token, account, profile, user }) {
            if (user && account) {
                const firebaseUser = await getFirebaseUser(user, account);
                token.role = firebaseUser.customClaims?.role;
                token.id = firebaseUser.uid;
            }
            return token;
        },
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
} as AuthOptions;

async function getFirebaseUser(user: User, account: Account | null) {
    if (account?.provider === 'google') {
        return await adminAuth.getUserByProviderUid(
            'google.com',
            account.providerAccountId,
        );
    }
    return await adminAuth.getUserByEmail(user.email || '');
}
