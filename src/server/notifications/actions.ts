'use server';

import { notifications } from '@/db/schema';
import { notificationsService as service } from './service';

type Notification = typeof notifications.$inferInsert;

export async function getNotification(id: string) {
  return service.get(id);
}

export async function getNotifications(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createNotification(notification: Notification) {
  return service.create(notification);
}

export async function updateNotification(
  id: string,
  notification: Partial<Notification>,
) {
  return service.update(id, notification);
}

export async function deleteNotification(id: string) {
  return service.delete(id);
}

export async function getUserNotifications(
  page: number = 1,
  size: number = 10,
  options: {
    search?: string;
    status?: 'unread' | 'read' | 'archived';
    type?: string;
  } = {},
) {
  return service.getUserNotifications({
    page,
    size,
    ...options,
  });
}

export async function getUnreadNotificationsCount() {
  return service.getUnreadCount();
}

export async function markNotificationAsRead(id: string) {
  return service.markAsRead(id);
}

export async function markAllNotificationsAsRead() {
  return service.markAllAsRead();
}

export async function getRecentNotifications(limit: number = 5) {
  return service.getRecentNotifications(limit);
}
