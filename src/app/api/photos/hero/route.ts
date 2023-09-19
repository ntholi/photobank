import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const photos = [
        {
            id: 2,
            url: `https://d3tw6tl1trq98w.cloudfront.net/02.jpg`,
            title: 'One',
        },
        {
            id: 1,
            url: `https://d3tw6tl1trq98w.cloudfront.net/01.jpg`,
            title: 'One',
        },
        {
            id: 3,
            url: `https://d3tw6tl1trq98w.cloudfront.net/03.jpg`,
            title: 'One',
        },
        {
            id: 4,
            url: `https://d3tw6tl1trq98w.cloudfront.net/04.jpg`,
            title: 'One',
        },
        {
            id: 6,
            url: `https://d3tw6tl1trq98w.cloudfront.net/05.jpg`,
            title: 'One',
        },
    ];

    return NextResponse.json({ photos });
}
