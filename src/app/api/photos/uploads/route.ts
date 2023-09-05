import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_BUCKET_NAME || '';
const bucketRegion = process.env.AWS_BUCKET_REGION || '';
const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY || '';
const bucketSecretKey = process.env.AWS_BUCKET_SECRET_KEY || '';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url || '');

    const userId = searchParams.get('userId') || '';

    const photos = await prisma.photo.findMany({
        where: {
            userId: userId,
            status: userId !== session?.user?.id ? 'approved' : undefined,
        },
    });
    return NextResponse.json({ photos });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const data = await request.formData();
    if (!session?.user) {
        return NextResponse.json(
            { error: 'You must be logged in to upload a photo' },
            { status: 401 },
        );
    }

    const s3 = new S3Client({
        region: bucketRegion,
        credentials: {
            accessKeyId: bucketAccessKey,
            secretAccessKey: bucketSecretKey,
        },
    });

    const file = data.get('file') as File;
    const fileFileBuffer = (await file.arrayBuffer()) as any;

    const res = await s3.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: createFileName(file, session.user.id),
            Body: fileFileBuffer,
            ContentType: file.type,
        }),
    );

    console.log('res', res);

    return NextResponse.json({ success: true });
}

function createFileName(file: File, userId: string) {
    const ext = file.name.split('.').pop();
    return `${userId}-${Date.now()}.${ext}`;
}
