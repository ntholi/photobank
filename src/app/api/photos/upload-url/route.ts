import { NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { bucketName, s3Client } from '@/lib/config/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { canUpload } from '@/lib/helpers/user-helper';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: 'You must be logged in to upload a photo' },
      { status: 401 },
    );
  }
  if (!canUpload(session.user)) {
    return NextResponse.json(
      { error: 'You do not have permission to upload a photo' },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.url);
  const ext = searchParams.get('ext') || '';

  const fileName = `${nanoid()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });

  return NextResponse.json({ url, fileName });
}
