'use server';

import { ContributorApplication } from '@prisma/client';

import { contributorApplicationsService as service } from '@/repositories/contributor-applications/service';
import { ContributorApplication as Application } from '@prisma/client';

export async function getContributorApplication(id: number) {
  return service.get(id);
}

export async function updateApplicationStatus(
  id: number,
  userId: string,
  status: ContributorApplication['status'],
) {
  return service.updateApplicationStatus(id, userId, status);
}

export async function getAllContributorApplications(
  page: number = 1,
  search = '',
) {
  return service.search(page, search, []);
}

export async function getPendingContributorApplications() {
  return service.getPendingApplications();
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
