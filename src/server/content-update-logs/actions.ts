'use server';

import { contentUpdateLogs } from '@/db/schema';
import { contentUpdateLogService as service } from './service';
import { eq } from 'drizzle-orm';

export async function getContentUpdateLog(id: string) {
  return service.get(id);
}

export async function getContentUpdateLogs(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function getContentUpdateLogsByContentId(
  contentId: string,
  page: number = 1,
  size: number = 20,
) {
  return service.getByContentId(contentId, page, size);
}

export async function getContentUpdateLogsByContentIdWithUser(
  contentId: string,
  page: number = 1,
  size: number = 20,
) {
  return service.getByContentIdWithUser(contentId, page, size);
}

export async function getContentUpdateLogsByUserId(
  userId: string,
  page: number = 1,
  size: number = 20,
) {
  return service.getByUserId(userId, page, size);
}

export async function logContentUpdate(
  contentId: string,
  userId: string,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>,
) {
  return service.logUpdate(contentId, userId, oldValues, newValues);
}

export async function logContentDelete(
  contentId: string,
  userId: string,
  deletedValues: Record<string, unknown>,
) {
  return service.logDelete(contentId, userId, deletedValues);
}
