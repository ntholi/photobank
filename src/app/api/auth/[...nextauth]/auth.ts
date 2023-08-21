import { prisma } from '@/lib/db';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authOptions = {
    adapter: PrismaAdapter(prisma) as any,
    secret: process.env.SECRET,
    session: {
        strategy: 'jwt',
    },
    debug: process.env.NODE_ENV === 'development',
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
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user) {
                    throw new Error('No user found');
                }
                const match = bcrypt.compareSync(
                    credentials.password,
                    user.hashedPassword || '',
                );
                if (!match) {
                    throw new Error('Incorrect password');
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    image: user.image,
                } as any;
            },
        }),
    ],
} as AuthOptions;