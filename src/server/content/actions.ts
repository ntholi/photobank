'use server';

import { content } from '@/db/schema';
import { contentService as service } from './service';
import { generatePresignedUrl } from '@/lib/aws';
import { ContentFilterOptions } from './repository';
import { upsertLocationByPlaceId } from '@/server/locations/actions';
import { contentLabelsService } from '@/server/content-labels/service';
import { ContentLabel as RecognitionContentLabel } from '@/lib/recognition';
import { contentTagsService } from '@/server/content-tags/service';

type Content = typeof content.$inferInsert;

type CreateContentInput = Omit<Content, 'locationId'> & {
  locationData?: {
    placeId: string;
    name: string;
    address?: string | null;
    latitude: number;
    longitude: number;
  };
  contentLabels?: RecognitionContentLabel[];
  selectedTags?: Array<{ tag: string; confidence: number }>;
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
  const { locationData, contentLabels, selectedTags, ...rest } = input;

  let locationId: string | undefined;
  if (locationData) {
    const location = await upsertLocationByPlaceId(locationData);
    locationId = location.id;
  }

  const contentData: Content = {
    ...(rest as Content),
    locationId,
  };

  const created = await service.create(contentData);

  if (created?.id) {
    if (contentLabels && contentLabels.length > 0) {
      try {
        await contentLabelsService.createMany(
          created.id as string,
          contentLabels,
        );
      } catch (err) {
        console.error('Failed to save content labels', err);
      }
    }

    if (selectedTags && selectedTags.length > 0) {
      try {
        await contentTagsService.createContentTags(
          created.id as string,
          selectedTags,
        );
      } catch (err) {
        console.error('Failed to save content tags', err);
      }
    }
  }

  return created;
}

type UpdateContentInput = Partial<Content> & {
  locationData?: {
    placeId: string;
    name: string;
    address?: string | null;
    latitude: number;
    longitude: number;
  };
  selectedTags?: Array<{ tag: string; confidence: number }>;
};

export async function updateContent(id: string, input: UpdateContentInput) {
  const { locationData, selectedTags, ...rest } = input;

  let patch: Partial<Content> = { ...rest };
  if (locationData) {
    const location = await upsertLocationByPlaceId(locationData);
    patch.locationId = location.id;
  }

  const updated = await service.update(id, patch);

  if (selectedTags) {
    try {
      await contentTagsService.updateContentTags(id, selectedTags);
    } catch (err) {
      console.error('Failed to update content tags', err);
    }
  }

  return updated;
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
