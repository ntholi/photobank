import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const photos = [
        {
            id: 1,
            url: `https://djvt9h5y4w4rn.cloudfront.net/one.JPG`,
            title: 'One',
        },
        {
            id: 2,
            url: `https://djvt9h5y4w4rn.cloudfront.net/two.JPG`,
            title: 'One',
        },
        {
            id: 3,
            url: `https://djvt9h5y4w4rn.cloudfront.net/three.JPG`,
            title: 'One',
        },
        {
            id: 4,
            url: `https://djvt9h5y4w4rn.cloudfront.net/four.JPG`,
            title: 'One',
        },
    ];

    return NextResponse.json({ photos });
}
