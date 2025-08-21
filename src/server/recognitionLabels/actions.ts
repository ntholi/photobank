'use server';

import { recognitionLabelsService } from './service';

export async function getRecognitionLabelsByContentId(contentId: string) {
  return recognitionLabelsService.getByContentId(contentId);
}

export async function getRecognitionLabels(
  params: Parameters<typeof recognitionLabelsService.getAll>[0]
) {
  return recognitionLabelsService.getAll(params);
}

export async function createRecognitionLabels(
  contentId: string,
  labels: Parameters<typeof recognitionLabelsService.createMany>[1]
) {
  return recognitionLabelsService.createMany(contentId, labels);
}

export async function deleteRecognitionLabelsByContentId(contentId: string) {
  return recognitionLabelsService.deleteByContentId(contentId);
}
