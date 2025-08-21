'use server';

import { contentLabelsService } from './service';

export async function getContentLabelsByContentId(contentId: string) {
  return contentLabelsService.getByContentId(contentId);
}

export async function getContentLabels(
  params: Parameters<typeof contentLabelsService.getAll>[0]
) {
  return contentLabelsService.getAll(params);
}

export async function createContentLabels(
  contentId: string,
  labels: Parameters<typeof contentLabelsService.createMany>[1]
) {
  return contentLabelsService.createMany(contentId, labels);
}

export async function deleteContentLabelsByContentId(contentId: string) {
  return contentLabelsService.deleteByContentId(contentId);
}
