import { contentLabels } from '@/db/schema';
import ContentLabelRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';
import { ContentLabel as RecognitionContentLabel } from '@/lib/recognition';

type ContentLabel = typeof contentLabels.$inferInsert;

class ContentLabelService {
  constructor(private readonly repository = new ContentLabelRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async getAll(params: QueryOptions<typeof contentLabels>) {
    return withAuth(async () => this.repository.query(params), []);
  }

  async create(data: ContentLabel) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Partial<ContentLabel>) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async createMany(contentId: string, labels: RecognitionContentLabel[]) {
    return withAuth(async () => {
      const labelsToInsert: ContentLabel[] = labels.map((label) => ({
        contentId,
        name: label.name,
        confidence: Math.round(label.confidence * 100),
        instances: label.instances,
        parents: label.parents,
        aliases: label.aliases,
        categories: label.categories,
      }));

      return await this.repository.createMany(labelsToInsert);
    }, ['contributor']);
  }
}

export const contentLabelsService = serviceWrapper(
  ContentLabelService,
  'ContentLabel'
);
