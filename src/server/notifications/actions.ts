'use server';


import { notifications } from '@/db/schema';
import { notificationsService as service} from './service';

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

export async function updateNotification(id: string, notification: Partial<Notification>) {
  return service.update(id, notification);
}

export async function deleteNotification(id: string) {
  return service.delete(id);
}