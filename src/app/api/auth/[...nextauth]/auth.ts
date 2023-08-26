import { prisma } from '@/lib/db';
import { AuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { auth } from '@/lib/config/firebase';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
} from 'firebase/auth';
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
                    await saveUserToDB(userCredential.user);
                }
                return true;
            } else {
                return false;
            }
        },

        async jwt({ token, account, profile, user }) {
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: {
                        //TODO: THIS WILL NOT WORK FOR FACEBOOK PROVIDER BECAUSE EMAIL ADDRESSES ARE OPTIONAL,
                        //TODO: AND I CANNOT USE user.id, BECAUSE THAT VALUE HOLDS A PROVIDER SPECIFIC ID NOT THE FIREBASE UID
                        email: user.email as string,
                    },
                });
                if (!dbUser) {
                    throw new Error(`User ${user.id} not found in database`);
                }
                token.id = user.id;
                token.username = dbUser.username;
                token.name = `${dbUser.firstName} ${dbUser.lastName}`;
                token.email = dbUser.email;
                token.role = dbUser.role;
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
