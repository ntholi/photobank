'use server';

import { Prisma } from '@prisma/client';

import { contributorApplicationsService as service } from '@/repositories/contributor-applications/service';
import { ContributorApplication as Application } from '@prisma/client';

export async function getContributorApplication(id: number) {
  return service.get(id);
}

export async function getAllContributorApplications(
  page: number = 1,
  search = '',
) {
  return service.search(page, search, []);
}

export async function createContributorApplication(application: Application) {
  return service.create(application);
}

export async function updateContributorApplication(
  id: number,
  application: Application,
) {
  return service.update(id, application);
}

export async function deleteContributorApplication(id: number) {
  return service.delete(id);
}
