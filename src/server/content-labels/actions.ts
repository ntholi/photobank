'use server';

import { contentLabels } from '@/db/schema';
import { contentLabelsService as service } from './service';
import { ContentLabel as RecognitionContentLabel } from '@/lib/recognition';

type ContentLabel = typeof contentLabels.$inferInsert;

export async function getContentLabel(id: string) {
  return service.get(id);
}

export async function getContentLabels(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createContentLabel(contentLabel: ContentLabel) {
  return service.create(contentLabel);
}

export async function createContentLabels(
  contentId: string,
  labels: RecognitionContentLabel[]
) {
  return service.createMany(contentId, labels);
}

export async function updateContentLabel(
  id: string,
  contentLabel: Partial<ContentLabel>
) {
  return service.update(id, contentLabel);
}

export async function deleteContentLabel(id: string) {
  return service.delete(id);
}
