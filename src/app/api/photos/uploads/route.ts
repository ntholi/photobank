import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { bucketName, s3Client } from '@/lib/config/aws';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url || '');
    const userId = searchParams.get('userId') || '';
    const data = await prisma.photo.findMany({
        where: {
            userId: userId,
            status: userId !== session?.user?.id ? 'published' : undefined,
        },
        include: {
            user: true,
            location: true,
        },
    });
    const photoPromises = data.map(async (it) => {
        const params = {
            Bucket: bucketName,
            Key: it.fileName,
        };
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
            expiresIn: 60,
        });
        return { ...it, url };
    });
    const photos = await Promise.all(photoPromises);

    return NextResponse.json({ photos });
}
