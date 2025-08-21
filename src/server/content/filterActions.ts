'use server';

import { content, contentTags, locations, tags } from '@/db/schema';
import { db } from '@/db';
import { and, eq, inArray, like, sql, desc } from 'drizzle-orm';
import withAuth from '@/server/base/withAuth';

export interface ContentFilterOptions {
  page?: number;
  size?: number;
  locationId?: string;
  tagIds?: string[];
  search?: string;
}

export async function getFilteredContent(options: ContentFilterOptions) {
  return withAuth(async () => {
    const {
      page = 1,
      size = 12,
      locationId,
      tagIds = [],
      search = '',
    } = options;

    const offset = (page - 1) * size;
    const conditions = [];

    if (locationId) {
      conditions.push(eq(content.locationId, locationId));
    }

    if (search) {
      conditions.push(like(content.fileName, `%${search}%`));
    }

    let query = db
      .select({
        id: content.id,
        fileName: content.fileName,
        s3Key: content.s3Key,
        thumbnailKey: content.thumbnailKey,
        watermarkedKey: content.watermarkedKey,
        type: content.type,
        status: content.status,
        locationId: content.locationId,
        fileSize: content.fileSize,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      })
      .from(content);

    if (tagIds.length > 0) {
      query = query
        .innerJoin(contentTags, eq(content.id, contentTags.contentId))
        .where(and(...conditions, inArray(contentTags.tagId, tagIds)))
        .groupBy(content.id);
    } else if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const items = await query
      .orderBy(desc(content.createdAt))
      .limit(size)
      .offset(offset);

    const countQuery =
      tagIds.length > 0
        ? db
            .select({ count: sql<number>`count(DISTINCT ${content.id})` })
            .from(content)
            .innerJoin(contentTags, eq(content.id, contentTags.contentId))
            .where(and(...conditions, inArray(contentTags.tagId, tagIds)))
        : db
            .select({ count: sql<number>`count(*)` })
            .from(content)
            .where(conditions.length > 0 ? and(...conditions) : undefined);

    const [{ count: totalItems }] = await countQuery;

    return {
      items,
      totalPages: Math.ceil(totalItems / size),
      totalItems,
      currentPage: page,
    };
  }, ['all']);
}

export async function getAllLocations() {
  return withAuth(async () => {
    const items = await db
      .select({
        id: locations.id,
        name: locations.name,
      })
      .from(locations)
      .orderBy(locations.name);

    return items;
  }, ['all']);
}

export async function getAllTags() {
  return withAuth(async () => {
    const items = await db
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(tags)
      .orderBy(tags.name);

    return items;
  }, ['all']);
}
