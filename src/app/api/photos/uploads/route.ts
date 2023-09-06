import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

    const { fileName, url } = await uploadImage(data);
    const photo = await prisma.photo.create({
        data: {
            userId: session.user.id,
            fileName: fileName,
        },
    });

    return NextResponse.json({ photo, url });
}

async function uploadImage(data: FormData) {
    const s3 = new S3Client({
        region: bucketRegion,
        credentials: {
            accessKeyId: bucketAccessKey,
            secretAccessKey: bucketSecretKey,
        },
    });

    const file = data.get('file') as File;
    const ext = file.name.split('.').pop();
    const fileName = `${uuid()}.${ext}`;
    const buffer = (await file.arrayBuffer()) as any;

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
    };
    await s3.send(new PutObjectCommand(params));

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 });

    return { fileName, url };
}
