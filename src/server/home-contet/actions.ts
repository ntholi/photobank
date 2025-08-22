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

export async function getAllHomeContentWithDetails() {
  return service.getAllWithDetails();
}

export async function addContentToHome(contentIds: string[]) {
  return service.addContentToHome(contentIds);
}

export async function removeContentFromHome(contentId: string) {
  return service.removeContentFromHome(contentId);
}

export async function updateHomeContentOrder(
  items: { id: string; position: number }[]
) {
  return service.updateOrder(items);
}
