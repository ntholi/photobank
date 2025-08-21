import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

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

function createBedrockClient() {
  const bucketRegion = process.env.AWS_BUCKET_REGION || '';
  const bucketAccessKey = process.env.AWS_BUCKET_ACCESS_KEY || '';
  const bucketSecretKey = process.env.AWS_BUCKET_SECRET_KEY || '';

  if (!bucketRegion) {
    throw new Error('AWS_BUCKET_REGION environment variable is required');
  }

  return new BedrockRuntimeClient({
    region: bucketRegion,
    credentials: {
      accessKeyId: bucketAccessKey,
      secretAccessKey: bucketSecretKey,
    },
  });
}

export const s3Client = createS3Client();
export const rekognitionClient = createRekognitionClient();
export const bedrockClient = createBedrockClient();

export async function generatePresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!key) {
    throw new Error('S3 key is required to generate presigned URL');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}
