import { adminAuth } from '@/lib/config/firebase-admin';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
    const { searchParams } = new URL(req.url || '');
    const email = searchParams.get('email') || '';

    let user = null;
    try {
        user = await adminAuth.getUserByEmail(email);
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({
        exists: !!user,
    });
}
