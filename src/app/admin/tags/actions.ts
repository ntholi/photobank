'use server';

import { Prisma } from '@prisma/client';

import { tagsService } from '@/repositories/tags/service';


type Tag = Prisma.TagCreateInput;

export async function getTag(id: number) {
  return tagsService.get(id);
}

export async function getAllTags(page: number = 1, search = '') {
  return tagsService.search(page, search, []);
}

export async function createTag(tag: Tag) {
  return tagsService.create(tag);
}

export async function updateTag(id: number, tag: Tag) {
  return tagsService.update(id, tag);
}

export async function deleteTag(id: number) {
  return tagsService.delete(id);
}