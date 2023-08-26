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

            async profile(profile: any, tokens: any): Promise<User> {
                console.log({ profile });
                const user = await prisma.user.findUnique({
                    where: {
                        email: profile.email,
                    },
                });
                if (!user) {
                    throw new Error('No user found');
                }
                return {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    image: user.image,
                    username: user?.username || '',
                    role: user.role,
                };
            },
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
        async signIn({ user, account, profile, email, credentials }) {
            const isAllowedToSignIn = true;
            if (isAllowedToSignIn) {
                if (account?.provider === 'google') {
                    const credential = GoogleAuthProvider.credential(
                        account.id_token,
                    );

                    try {
                        const userCredential = await signInWithCredential(
                            auth,
                            credential,
                        );
                        await saveUserToDB(userCredential.user);
                    } catch (error: any) {
                        console.log(error);
                    }
                }
                return true;
            } else {
                return false;
            }
        },

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
