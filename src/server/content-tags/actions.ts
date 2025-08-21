'use server';

import { contentTagsService } from './service';

type ContentTag = {
  contentId: string;
  tagId: string;
  confidence?: number;
};

export async function getContentTag(contentId: string, tagId: string) {
  return contentTagsService.get(contentId, tagId);
}

export async function getContentTagsByContentId(contentId: string) {
  return contentTagsService.getContentTagsByContentId(contentId);
}

export async function createContentTag(contentTag: ContentTag) {
  return contentTagsService.create(contentTag);
}

export async function createContentTags(
  contentId: string,
  selectedTags: Array<{ tag: string; confidence: number }>
) {
  return contentTagsService.createContentTags(contentId, selectedTags);
}

export async function updateContentTag(
  contentId: string,
  tagId: string,
  contentTag: Partial<ContentTag>
) {
  return contentTagsService.update(contentId, tagId, contentTag);
}

export async function deleteContentTag(contentId: string, tagId: string) {
  return contentTagsService.delete(contentId, tagId);
}
