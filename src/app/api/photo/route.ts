import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('photoUrl');

    const body = await request.json();
    console.log(body);

    return NextResponse.json({ success: true });
}
