'use server';

import { content } from '@/db/schema';
import { contentService as service } from './service';
import { getImageUrl } from '@/lib/utils';

type Content = typeof content.$inferInsert;

export async function getContent(id: string) {
  return service.get(id);
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

export async function getContentUrls(contentItem: typeof content.$inferSelect) {
  const urls = {
    original: contentItem.s3Key ? getImageUrl(contentItem.s3Key) : null,
    thumbnail: contentItem.thumbnailKey
      ? getImageUrl(contentItem.thumbnailKey)
      : null,
    watermarked: contentItem.watermarkedKey
      ? getImageUrl(contentItem.watermarkedKey)
      : null,
  };

  return urls;
}
