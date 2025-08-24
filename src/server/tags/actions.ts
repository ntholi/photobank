'use server';

import { tags } from '@/db/schema';
import { tagsService as service } from './service';

type Tag = typeof tags.$inferInsert;

export async function getTag(id: string) {
  return service.get(id);
}

export async function getTags(
  page: number = 1,
  search = '',
  size: number = 20
) {
  return service.getAll({ page, search, size });
}

export async function getAllTags() {
  const result = await service.getAll({ page: 1, size: 1000 });
  return result.items || [];
}

export async function getPopularTags() {
  return service.getPopularTags();
}

export async function createTag(tag: Tag) {
  return service.create(tag);
}

export async function updateTag(id: string, tag: Partial<Tag>) {
  return service.update(id, tag);
}

export async function deleteTag(id: string) {
  return service.delete(id);
}
