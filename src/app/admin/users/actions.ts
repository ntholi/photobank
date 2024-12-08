'use server';

import { Prisma } from '@prisma/client';
import { usersService } from '@/repositories/users/service';

type User = Prisma.UserCreateInput;

export async function getUser(id: string) {
  return usersService.get(id);
}

export async function getAllUsers(page: number = 1, search = '') {
  return usersService.search(page, search, []);
}

export async function createUser(user: User) {
  return usersService.create(user);
}

export async function updateUser(id: string, user: User) {
  return usersService.update(id, user);
}

export async function deleteUser(id: string) {
  return usersService.delete(id);
}
