import { NextResponse } from 'next/server';
import { saveUserToDatabase } from '../signup/route';
import { User } from 'firebase/auth';

type Props = { params: { id: string } };

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');
    const user = (await request.json()) as User;
    await saveUserToDatabase(user);

    return NextResponse.json({ success: true });
}
