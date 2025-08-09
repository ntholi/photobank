'use server';

import { content } from '@/db/schema';
import { contentService as service } from './service';

type Content = typeof content.$inferInsert;

export async function getContent(id: string) {
  return service.get(id);
}

export async function getContents(page: number = 1, search = '') {
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
