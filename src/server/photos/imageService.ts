import { s3Client, bucketName, processedBucketName } from '@/lib/config/aws';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import Sharp from 'sharp';
import WatermarkUtility from './WatermarkUtility';

interface ProcessedImages {
  thumbnail: string;
  watermarked: string;
}

export async function processImage(fileName: string): Promise<ProcessedImages> {
  try {
    // Get the original image from S3
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
    const extension = fileName.split('.')[1];

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

    return {
      thumbnail: thumbnailKey,
      watermarked: watermarkedKey,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
