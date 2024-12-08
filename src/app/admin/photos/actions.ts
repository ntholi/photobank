'use server';

import { Prisma } from '@prisma/client';

import { photosService } from '@/repositories/photos/service';


type Photo = Prisma.PhotoCreateInput;

export async function getPhoto(id: string) {
  return photosService.get(id);
}

export async function getAllPhotos(page: number = 1, search = '') {
  return photosService.search(page, search, []);
}

export async function createPhoto(photo: Photo) {
  return photosService.create(photo);
}

export async function updatePhoto(id: string, photo: Photo) {
  return photosService.update(id, photo);
}

export async function deletePhoto(id: string) {
  return photosService.delete(id);
}