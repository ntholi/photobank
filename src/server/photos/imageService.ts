import { s3Client, bucketName, processedBucketName } from '@/lib/config/aws';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  RekognitionClient,
  DetectLabelsCommand,
} from '@aws-sdk/client-rekognition';
import Sharp from 'sharp';
import WatermarkUtility from './WatermarkUtility';

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY || '',
  },
});

interface ProcessedImages {
  thumbnail: string;
  watermarked: string;
  labels: Label[];
}

interface Label {
  name: string;
  confidence: number;
}

export async function processImage(fileName: string): Promise<ProcessedImages> {
  try {
    // Validate input
    if (!fileName) {
      throw new Error('fileName is required');
    }

    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const response = await s3Client.send(getCommand);
    const imageBuffer = await streamToBuffer(response.Body);

    const thumbnailBuffer = await Sharp(imageBuffer)
      .resize({ height: 500, withoutEnlargement: true })
      .toBuffer();

    const watermarkedBuffer = await new WatermarkUtility().addTextWatermark(
      imageBuffer,
      'Lehakoe',
      {
        width: 900,
        fontSize: 180,
      },
    );

    const fileNameWithoutExt = fileName.split('.')[0];
    const extension = fileName.split('.')[1].toLowerCase();

    const thumbnailKey = `${fileNameWithoutExt}_thumb.${extension}`;
    const watermarkedKey = `${fileNameWithoutExt}_watermarked.${extension}`;

    await Promise.all([
      s3Client.send(
        new PutObjectCommand({
          Bucket: processedBucketName,
          Key: thumbnailKey,
          Body: thumbnailBuffer,
          ContentType: `image/${extension}`,
        }),
      ),
      s3Client.send(
        new PutObjectCommand({
          Bucket: processedBucketName,
          Key: watermarkedKey,
          Body: watermarkedBuffer,
          ContentType: `image/${extension}`,
        }),
      ),
    ]);

    const labels = await detectLabels(thumbnailKey);

    const uniqueLabels = labels.filter(
      (label, index) =>
        labels.findIndex((l) => l.name === label.name) === index,
    );
    return {
      thumbnail: thumbnailKey,
      watermarked: watermarkedKey,
      labels: uniqueLabels,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

async function detectLabels(key: string): Promise<Label[]> {
  try {
    const command = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: processedBucketName,
          Name: key,
        },
      },
      MaxLabels: 20,
      MinConfidence: 85,
    });

    const labelResponse = await rekognitionClient.send(command);
    const labels =
      labelResponse.Labels?.reduce<Label[]>((acc, label) => {
        if (label.Name && label.Confidence && label.Categories) {
          const categoryLabels = label.Categories.map((category) => ({
            name: category.Name || '',
            confidence: label.Confidence,
          }));

          // Only add labels that have both name and confidence
          return acc.concat(
            categoryLabels.filter(
              (l): l is Label =>
                typeof l.name === 'string' && typeof l.confidence === 'number',
            ),
          );
        }
        return acc;
      }, []) ?? [];

    return labels;
  } catch (error) {
    console.error('Error in detectLabels:', {
      error,
      key,
      bucket: processedBucketName,
    });
    throw error;
  }
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  if (!stream) {
    throw new Error('Stream is required');
  }

  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
