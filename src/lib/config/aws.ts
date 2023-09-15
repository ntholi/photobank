import { S3, S3Client } from '@aws-sdk/client-s3';

export const bucketName = process.env.AWS_BUCKET_NAME || '';
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
