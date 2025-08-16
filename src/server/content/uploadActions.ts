'use server';

import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, bucketName } from '@/lib/aws';
import { nanoid } from 'nanoid';
import withAuth from '@/server/base/withAuth';
import { serviceWrapper } from '@/server/base/serviceWrapper';

type UploadResult = {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/mov',
  'video/avi',
  'video/quicktime',
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

async function uploadFileToS3(file: File, key: string): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    Metadata: {
      fileName: file.name,
      fileSize: file.size.toString(),
      uploadedAt: new Date().toISOString(),
    },
  });

  await s3Client.send(command);

  const url = `https://${bucketName}.s3.amazonaws.com/${key}`;

  return {
    key,
    url,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  };
}

export async function uploadContentFile(
  formData: FormData
): Promise<UploadResult> {
  return withAuth(async () => {
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images and videos are allowed.');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    // Generate unique key
    const fileExtension = file.name.split('.').pop();
    const key = `content/${nanoid()}.${fileExtension}`;

    return uploadFileToS3(file, key);
  }, ['contributor']);
}

export async function deleteContentFile(key: string): Promise<void> {
  return withAuth(async () => {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  }, ['contributor']);
}
