import { S3Client } from '@aws-sdk/client-s3';

export const bucketName = process.env.AWS_ORIGINAL_BUCKET || '';
export const processedBucketName = process.env.AWS_PROCESSED_BUCKET || '';
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

export function getS3Url(key: string, bucket: string = bucketName): string {
  return `https://${bucket}.s3.${bucketRegion}.amazonaws.com/${key}`;
}

export function getThumbnailUrl(thumbnailKey: string): string {
  return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${thumbnailKey}`;
}

export function getWatermarkedUrl(watermarkedKey: string): string {
  return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${watermarkedKey}`;
}
