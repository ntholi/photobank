'use server';

import { content, contentTags } from '@/db/schema';
import { contentService as service } from './service';
import { generatePresignedUrl } from '@/lib/aws';
import { eq } from 'drizzle-orm';
import { ContentFilterOptions } from './repository';
import { upsertLocationByPlaceId } from '@/server/locations/actions';

type Content = typeof content.$inferInsert;

type CreateContentInput = Omit<Content, 'locationId'> & {
  locationData?: {
    placeId: string;
    name: string;
    address?: string | null;
    latitude: number;
    longitude: number;
  };
};

export async function getContent(id: string) {
  return service.get(id);
}

export async function getContentByTag(
  tagId: string,
  page: number = 1,
  size: number = 15,
) {
  return service.getContentByTag(tagId, { page, size });
}

export async function getContentList(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createContent(input: CreateContentInput) {
  let locationId: string | undefined;

  if (input.locationData) {
    const location = await upsertLocationByPlaceId(input.locationData);
    locationId = location.id;
  }

  const contentData: Content = {
    ...input,
    locationId: locationId,
  };

  return service.create(contentData);
}

export async function updateContent(id: string, content: Partial<Content>) {
  return service.update(id, content);
}

export async function deleteContent(id: string) {
  return service.delete(id);
}

export async function getPresignedUrl(s3Key: string) {
  return generatePresignedUrl(s3Key, 900);
}

export async function getFilteredContent(options: ContentFilterOptions) {
  return service.getFilteredContent(options);
}

export async function getGalleryContent(
  page: number = 1,
  search?: string,
  tagIds?: string[],
) {
  return service.getFilteredContent({
    page,
    size: 30,
    search,
    tagIds,
  });
}

export async function getSimilarContent(contentId: string, limit: number = 20) {
  return service.getSimilarContent(contentId, limit);
}

export async function getContentWithDetails(id: string) {
  return service.getContentWithDetails(id);
}

export async function getUserUploads(
  userId: string,
  page: number = 1,
  size: number = 12,
) {
  return service.getByUser(userId, page, size);
}
