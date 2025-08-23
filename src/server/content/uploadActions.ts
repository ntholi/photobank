'use server';

import { bucketName, processedBucketName, s3Client } from '@/lib/aws';
import {
  createThumbnail,
  createWatermarkedImage,
  isImageFile,
} from '@/lib/imageProcessor';
import { ContentLabel, detectLabelsFromBuffer } from '@/lib/recognition';
import { selectTagsForContent } from '@/lib/titan';
import withAuth from '@/server/base/withAuth';
import { tagsService } from '@/server/tags/service';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

type UploadResult = {
  key: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  thumbnailKey: string;
  watermarkedKey: string;
  contentLabels?: ContentLabel[];
  selectedTags?: Array<{ tag: string; confidence: number }>;
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
  let contentLabels: ContentLabel[] | undefined;
  let selectedTags: Array<{ tag: string; confidence: number }> | undefined;

  if (isImageFile(file.type)) {
    try {
      const thumbnail = await createThumbnail(buffer);
      thumbnailKey = `${baseKey}_thumb.jpg`;

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

      const watermarked = await createWatermarkedImage(buffer, 900, 'Lehakoe');
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
        contentLabels = recognitionResult.labels;
        console.log(`Detected ${contentLabels.length} labels for image ${key}`);

        if (contentLabels.length > 0) {
          try {
            const allTagsResult = await tagsService.getAll({});
            const availableTagNames = allTagsResult.items.map(
              (tag: { name: string }) => tag.name
            );
            const labelNames = contentLabels.map((label) => label.name);

            selectedTags = await selectTagsForContent(
              labelNames,
              availableTagNames,
              3
            );
            console.log(
              `Selected ${selectedTags.length} tags for image ${key}:`,
              selectedTags
                .map((item) => `${item.tag}:${item.confidence}`)
                .join(', ')
            );
          } catch (error) {
            console.error('Failed to select tags with Titan:', error);
            selectedTags = undefined;
          }
        }
      } catch (error) {
        console.error('Failed to detect labels:', error);
        contentLabels = undefined;
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
    contentLabels,
    selectedTags,
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
