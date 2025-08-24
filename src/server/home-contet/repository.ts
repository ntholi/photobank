import { db } from '@/db';
import { homeContent } from '@/db/schema';
import BaseRepository from '@/server/base/BaseRepository';
import { asc, eq } from 'drizzle-orm';

export default class HomeContentRepository extends BaseRepository<
  typeof homeContent,
  'id'
> {
  constructor() {
    super(homeContent, homeContent.id);
  }

  async getAllWithDetails() {
    const items = await db.query.homeContent.findMany({
      orderBy: [asc(homeContent.position)],
      with: {
        content: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
              },
            },
            location: {
              columns: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    return items.map((item) => ({
      id: item.id,
      position: item.position,
      contentId: item.contentId,
      createdAt: item.createdAt || new Date(),
      content: {
        id: item.content.id,
        fileName: item.content.fileName,
        description: item.content.description,
        s3Key: item.content.s3Key,
        thumbnailKey: item.content.thumbnailKey,
        watermarkedKey: item.content.watermarkedKey,
        type: item.content.type,
        status: item.content.status,
        locationId: item.content.locationId,
        user: item.content.user
          ? {
              id: item.content.user.id,
              name: item.content.user.name,
            }
          : null,
        location: item.content.location
          ? {
              id: item.content.location.id,
              name: item.content.location.name,
              address: item.content.location.address,
            }
          : null,
      },
    }));
  }

  async addContentToHome(contentIds: string[]) {
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
  }

  async removeContentFromHome(contentId: string) {
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
  }

  async updateOrder(items: { id: string; position: number }[]) {
    for (const item of items) {
      await db
        .update(homeContent)
        .set({ position: item.position })
        .where(eq(homeContent.id, item.id));
    }

    return { success: true };
  }
}

export const homeContentRepository = new HomeContentRepository();
