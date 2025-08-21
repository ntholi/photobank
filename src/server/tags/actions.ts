'use server';


import { tags } from '@/db/schema';
import { tagsService as service} from './service';

type Tag = typeof tags.$inferInsert;


export async function getTag(id: string) {
  return service.get(id);
}

export async function getTags(page: number = 1, search = '') {
  return service.getAll({ page, search });
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