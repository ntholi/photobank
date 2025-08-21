'use server';

import { bucketName, processedBucketName, s3Client } from '@/lib/aws';
import {
  createThumbnail,
  createWatermarkedImage,
  isImageFile,
} from '@/lib/imageProcessor';
import { detectLabelsFromBuffer, RecognitionLabel } from '@/lib/recognition';
import withAuth from '@/server/base/withAuth';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import { contentService } from './service';

type UploadResult = {
  key: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  thumbnailKey: string;
  watermarkedKey: string;
  recognitionLabels?: RecognitionLabel[];
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

  const baseKey = key.split('.')[0];
  let thumbnailKey: string;
  let watermarkedKey: string;
  let recognitionLabels: RecognitionLabel[] | undefined;

  if (isImageFile(file.type)) {
    try {
      const thumbnail = await createThumbnail(buffer, 300);
      thumbnailKey = `${baseKey}_thumb.webp`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: processedBucketName,
          Key: thumbnailKey,
          Body: thumbnail.buffer,
          ContentType: thumbnail.contentType,
          Metadata: {
            originalKey: key,
            type: 'thumbnail',
            width: thumbnail.width.toString(),
            height: thumbnail.height.toString(),
            processedAt: new Date().toISOString(),
          },
        })
      );

      const watermarked = await createWatermarkedImage(
        buffer,
        900,
        'Photobank'
      );
      watermarkedKey = `${baseKey}_watermarked.webp`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: processedBucketName,
          Key: watermarkedKey,
          Body: watermarked.buffer,
          ContentType: watermarked.contentType,
          Metadata: {
            originalKey: key,
            type: 'watermarked',
            width: watermarked.width.toString(),
            height: watermarked.height.toString(),
            processedAt: new Date().toISOString(),
          },
        })
      );

      try {
        const recognitionResult = await detectLabelsFromBuffer(buffer);
        recognitionLabels = recognitionResult.labels;
        console.log(
          `Detected ${recognitionLabels.length} labels for image ${key}`
        );
      } catch (error) {
        console.error('Failed to detect labels:', error);
        recognitionLabels = undefined;
      }
    } catch (error) {
      console.error('Failed to process image:', error);
      thumbnailKey = key;
      watermarkedKey = key;
    }
  } else {
    thumbnailKey = key;
    watermarkedKey = key;
  }

  const result: UploadResult = {
    key,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
    thumbnailKey,
    watermarkedKey,
    recognitionLabels,
  };

  return result;
}

export async function uploadContentFile(
  formData: FormData
): Promise<UploadResult> {
  return withAuth(async () => {
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file provided');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images and videos are allowed.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    const fileExtension = file.name.split('.').pop();
    const key = `${nanoid()}.${fileExtension}`;

    const uploadResult = await uploadFileToS3(file, key);

    return uploadResult;
  }, ['contributor']);
}

export async function deleteContentFile(key: string): Promise<void> {
  return withAuth(async () => {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);

    const baseKey = key.split('.')[0];

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: processedBucketName,
          Key: `${baseKey}_thumb.webp`,
        })
      );
    } catch (error) {
      console.error('Failed to delete thumbnail:', error);
    }

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: processedBucketName,
          Key: `${baseKey}_watermarked.webp`,
        })
      );
    } catch (error) {
      console.error('Failed to delete watermarked image:', error);
    }
  }, ['contributor']);
}
