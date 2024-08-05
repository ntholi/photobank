import { NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { auth } from '@/auth';

export const bucketName = 'lehakoe-virtual-tours'; //TODO: Make this an environment variable
const bucketRegion = process.env.AWS_BUCKET_REGION || '';
const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY || '';
const bucketSecretKey = process.env.AWS_BUCKET_SECRET_KEY || '';

export const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretKey,
  },
});

export async function GET(_: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: 'You must be logged in to upload a photo' },
      { status: 401 },
    );
  }
  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'You do not have permission to upload a photo' },
      { status: 403 },
    );
  }

  const fileName = `${nanoid()}.zip`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 2 });

  return NextResponse.json({ url, fileName });
}
