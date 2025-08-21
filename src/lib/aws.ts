import { S3Client } from '@aws-sdk/client-s3';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

export const bucketName = process.env.AWS_ORIGINAL_BUCKET || '';
export const processedBucketName = process.env.AWS_PROCESSED_BUCKET || '';

function createS3Client() {
  const bucketRegion = process.env.AWS_BUCKET_REGION || '';
  const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY || '';
  const bucketSecretKey = process.env.AWS_BUCKET_SECRET_KEY || '';

  if (!bucketRegion) {
    throw new Error('AWS_BUCKET_REGION environment variable is required');
  }

  return new S3Client({
    region: bucketRegion,
    credentials: {
      accessKeyId: bucketAccessKey,
      secretAccessKey: bucketSecretKey,
    },
  });
}

function createRekognitionClient() {
  const bucketRegion = process.env.AWS_BUCKET_REGION || '';
  const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY || '';
  const bucketSecretKey = process.env.AWS_BUCKET_SECRET_KEY || '';

  if (!bucketRegion) {
    throw new Error('AWS_BUCKET_REGION environment variable is required');
  }

  return new RekognitionClient({
    region: bucketRegion,
    credentials: {
      accessKeyId: bucketAccessKey,
      secretAccessKey: bucketSecretKey,
    },
  });
}

export const s3Client = createS3Client();
export const rekognitionClient = createRekognitionClient();
