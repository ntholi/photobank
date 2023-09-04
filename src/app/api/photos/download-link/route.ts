import { NextResponse } from 'next/server';
import { generateSignedUrl } from '../signedImageService';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url || '');
    const url = new URL(searchParams.get('url') || '');

    console.log('Requesting signed URL for', url.toString());

    const res = await generateSignedUrl(url);

    return NextResponse.json({ url: res.toString() });
}
