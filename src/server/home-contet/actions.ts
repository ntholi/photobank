'use server';

import { homeContent } from '@/db/schema';
import { homeContentService as service } from './service';

type HomeContent = typeof homeContent.$inferInsert;

export async function getHomeContent(id: string) {
  return service.get(id);
}

export async function getHomeContents(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createHomeContent(data: HomeContent) {
  return service.create(data);
}

export async function updateHomeContent(
  id: string,
  data: Partial<HomeContent>
) {
  return service.update(id, data);
}

export async function deleteHomeContent(id: string) {
  return service.delete(id);
}
