import { DetectLabelsCommand, Label } from '@aws-sdk/client-rekognition';
import { rekognitionClient, bucketName } from './aws';

export interface RecognitionLabel {
  name: string;
  confidence: number;
  instances?: string;
  parents?: string;
  aliases?: string;
  categories?: string;
}

export interface RecognitionResult {
  labels: RecognitionLabel[];
}

export async function detectLabels(
  s3Key: string,
  maxLabels: number = 50,
  minConfidence: number = 70
): Promise<RecognitionResult> {
  try {
    const command = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: s3Key,
        },
      },
      MaxLabels: maxLabels,
      MinConfidence: minConfidence,
      Features: ['GENERAL_LABELS'],
      Settings: {
        GeneralLabels: {
          LabelInclusionFilters: [],
          LabelExclusionFilters: [],
          LabelCategoryInclusionFilters: [],
          LabelCategoryExclusionFilters: [],
        },
      },
    });

    const response = await rekognitionClient.send(command);

    const labels: RecognitionLabel[] = (response.Labels || []).map(
      (label: Label) => ({
        name: label.Name || '',
        confidence: Math.round((label.Confidence || 0) * 100) / 100,
        instances: label.Instances?.length
          ? JSON.stringify(
              label.Instances.map((instance) => ({
                boundingBox: instance.BoundingBox,
                confidence: instance.Confidence,
              }))
            )
          : undefined,
        parents: label.Parents?.length
          ? JSON.stringify(label.Parents.map((parent) => parent.Name))
          : undefined,
        aliases: label.Aliases?.length
          ? JSON.stringify(label.Aliases.map((alias) => alias.Name))
          : undefined,
        categories: label.Categories?.length
          ? JSON.stringify(label.Categories.map((category) => category.Name))
          : undefined,
      })
    );

    return { labels };
  } catch (error) {
    console.error('Error detecting labels:', error);
    throw new Error(
      `Failed to detect labels: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function detectLabelsFromBuffer(
  imageBuffer: Buffer,
  maxLabels: number = 50,
  minConfidence: number = 70
): Promise<RecognitionResult> {
  try {
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: imageBuffer,
      },
      MaxLabels: maxLabels,
      MinConfidence: minConfidence,
      Features: ['GENERAL_LABELS'],
      Settings: {
        GeneralLabels: {
          LabelInclusionFilters: [],
          LabelExclusionFilters: [],
          LabelCategoryInclusionFilters: [],
          LabelCategoryExclusionFilters: [],
        },
      },
    });

    const response = await rekognitionClient.send(command);

    const labels: RecognitionLabel[] = (response.Labels || []).map(
      (label: Label) => ({
        name: label.Name || '',
        confidence: Math.round((label.Confidence || 0) * 100) / 100,
        instances: label.Instances?.length
          ? JSON.stringify(
              label.Instances.map((instance) => ({
                boundingBox: instance.BoundingBox,
                confidence: instance.Confidence,
              }))
            )
          : undefined,
        parents: label.Parents?.length
          ? JSON.stringify(label.Parents.map((parent) => parent.Name))
          : undefined,
        aliases: label.Aliases?.length
          ? JSON.stringify(label.Aliases.map((alias) => alias.Name))
          : undefined,
        categories: label.Categories?.length
          ? JSON.stringify(label.Categories.map((category) => category.Name))
          : undefined,
      })
    );

    return { labels };
  } catch (error) {
    console.error('Error detecting labels from buffer:', error);
    throw new Error(
      `Failed to detect labels: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
