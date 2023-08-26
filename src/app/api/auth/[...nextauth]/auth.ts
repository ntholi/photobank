import { prisma } from '@/lib/db';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import admin from '@/lib/config/firebase-admin';
import { auth } from '@/lib/config/firebase';
import { getIdTokenResult, signInWithEmailAndPassword } from 'firebase/auth';

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
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'Email',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Enter email and password');
                }
                const userCredentials = await signInWithEmailAndPassword(
                    auth,
                    credentials.email,
                    credentials.password,
                );
                const user = await prisma.user.findUnique({
                    where: {
                        id: userCredentials.user.uid,
                    },
                });
                if (!user) {
                    throw new Error('No user found');
                }

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    image: user.image,
                    role: user.role,
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.role = token.role;
            }
            return session;
        },
    },
} as AuthOptions;
