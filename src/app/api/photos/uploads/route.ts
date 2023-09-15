import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketName = process.env.AWS_BUCKET_NAME || '';
const bucketRegion = process.env.AWS_BUCKET_REGION || '';
const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY || '';
const bucketSecretKey = process.env.AWS_BUCKET_SECRET_KEY || '';
const cloudfrontPrivateKey = process.env.AWS_CLOUDFRONT_PRIVATE_KEY
    ? process.env.AWS_CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n')
    : '';

const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
    },
});

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
    await s3Client.send(new PutObjectCommand(params));

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });

    // call lambda via http request
    const lambdaUrl = `https://ydhxmfgb3m.execute-api.eu-central-1.amazonaws.com/Prod/process-image?filename=${fileName}`;
    await fetch(lambdaUrl);

    return { fileName, url };
}
