'use server';

import { homeContent, content } from '@/db/schema';
import { homeContentService as service } from './service';
import { db } from '@/db';
import { eq, inArray, asc } from 'drizzle-orm';
import withAuth from '@/server/base/withAuth';

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
  return withAuth(async () => {
    const items = await db
      .select({
        id: homeContent.id,
        position: homeContent.position,
        contentId: homeContent.contentId,
        createdAt: homeContent.createdAt,
        content: {
          id: content.id,
          fileName: content.fileName,
          thumbnailKey: content.thumbnailKey,
          watermarkedKey: content.watermarkedKey,
          type: content.type,
          status: content.status,
        },
      })
      .from(homeContent)
      .innerJoin(content, eq(homeContent.contentId, content.id))
      .orderBy(asc(homeContent.position));

    return items;
  }, ['all']);
}

export async function addContentToHome(contentIds: string[]) {
  return withAuth(async () => {
    const existingItems = await db
      .select({
        contentId: homeContent.contentId,
        position: homeContent.position,
      })
      .from(homeContent)
      .orderBy(asc(homeContent.position));

    const existingContentIds = new Set(
      existingItems.map((item) => item.contentId)
    );
    const newContentIds = contentIds.filter(
      (id) => !existingContentIds.has(id)
    );

    if (newContentIds.length === 0) {
      return { success: true, added: 0 };
    }

    const maxPosition =
      existingItems.length > 0
        ? Math.max(...existingItems.map((item) => item.position))
        : -1;

    const newItems = newContentIds.map((contentId, index) => ({
      contentId,
      position: maxPosition + index + 1,
    }));

    await db.insert(homeContent).values(newItems);

    return { success: true, added: newItems.length };
  }, ['moderator', 'admin']);
}

export async function removeContentFromHome(contentId: string) {
  return withAuth(async () => {
    await db.delete(homeContent).where(eq(homeContent.contentId, contentId));

    const remainingItems = await db
      .select({ id: homeContent.id, position: homeContent.position })
      .from(homeContent)
      .orderBy(asc(homeContent.position));

    const updates = remainingItems.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    for (const update of updates) {
      if (
        update.position !==
        remainingItems.find((i) => i.id === update.id)?.position
      ) {
        await db
          .update(homeContent)
          .set({ position: update.position })
          .where(eq(homeContent.id, update.id));
      }
    }

    return { success: true };
  }, ['moderator', 'admin']);
}

export async function updateHomeContentOrder(
  items: { id: string; position: number }[]
) {
  return withAuth(async () => {
    for (const item of items) {
      await db
        .update(homeContent)
        .set({ position: item.position })
        .where(eq(homeContent.id, item.id));
    }

    return { success: true };
  }, ['moderator', 'admin']);
}
