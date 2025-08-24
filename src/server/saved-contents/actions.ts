'use server';

import { savedContent } from '@/db/schema';
import { savedContentsService as service } from './service';

type SavedContent = typeof savedContent.$inferInsert;

export async function getSavedContent(id: string) {
  return service.get(id);
}

export async function getSavedContents(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createSavedContent(savedContent: SavedContent) {
  return service.create(savedContent);
}

export async function updateSavedContent(
  id: string,
  savedContent: Partial<SavedContent>
) {
  return service.update(id, savedContent);
}

export async function deleteSavedContent(id: string) {
  return service.delete(id);
}
