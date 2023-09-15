import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { bucketName, s3Client } from '@/lib/config/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { error: 'You must be logged in to upload a photo' },
            { status: 401 },
        );
    }

    const command = new PutObjectCommand({ Bucket: bucketName, Key: nanoid() });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });

    return NextResponse.json({ url });
}
