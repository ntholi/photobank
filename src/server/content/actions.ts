'use server';

import { content, contentTags } from '@/db/schema';
import { contentService as service } from './service';
import { eq } from 'drizzle-orm';

type Content = typeof content.$inferInsert;

export async function getContent(id: string) {
  return service.get(id);
}

export async function getContentByTag(
  tagId: string,
  page: number = 1,
  size: number = 15
) {
  return service.getContentByTag(tagId, { page, size });
}

export async function getContentList(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createContent(content: Content) {
  return service.create(content);
}

export async function updateContent(id: string, content: Partial<Content>) {
  return service.update(id, content);
}

export async function deleteContent(id: string) {
  return service.delete(id);
}
