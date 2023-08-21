import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const data = {
        message: 'Hello World',
    };

    return NextResponse.json(new Error('Hello World'), { status: 500 });
}
