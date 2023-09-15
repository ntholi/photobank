import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { nanoid } from 'nanoid';
import { bucketName, s3Client } from '@/lib/config/aws';
import axios from 'axios';
import { imageProcessor } from '@/lib/config/urls';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
        return NextResponse.json(
            { error: 'You must be an admin to get all photos' },
            { status: 401 },
        );
    }

    const photos = await prisma.photo.findMany();
    return NextResponse.json({ photos });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const { fileName } = await request.json();
    if (!session?.user) {
        return NextResponse.json(
            { error: 'You must be logged in to upload a photo' },
            { status: 401 },
        );
    }

    const res = await axios.get(imageProcessor(fileName));

    console.log('AWS Lambda Results:');
    console.log(res.data);

    const photo = await prisma.photo.create({
        data: {
            userId: session.user.id,
            fileName: fileName,
        },
    });

    return NextResponse.json({ photo });
}
