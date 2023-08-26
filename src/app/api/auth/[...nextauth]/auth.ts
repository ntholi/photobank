import { prisma } from '@/lib/db';
import { AuthOptions } from 'next-auth';
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
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // The email of the user's account used.

                        const email = error.email;
                        // The credential that was used.
                        const credential =
                            GoogleAuthProvider.credentialFromError(error);
                        // ...
                    }
                }
                return true;
            } else {
                // Return false to display a default error message
                return false;
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
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

async function createUserFromProvider(
    user: import('next-auth').User | import('next-auth/adapters').AdapterUser,
) {
    if (user.email) {
        const dbUser = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });
        // if (!dbUser) {
        //     const {} = destructureNames(user.name);
        //     await prisma.user.create({
        //         data: {
        //             email: user.email,
        //         },
        //     });
        // }
    }
}
