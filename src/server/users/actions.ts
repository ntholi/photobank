'use server';


import { users } from '@/db/schema';
import { usersService as service} from './service';

type User = typeof users.$inferInsert;


export async function getUser(id: number) {
  return service.get(id);
}

export async function getUsers(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createUser(user: User) {
  return service.create(user);
}

export async function updateUser(id: number, user: Partial<User>) {
  return service.update(id, user);
}

export async function deleteUser(id: number) {
  return service.delete(id);
}