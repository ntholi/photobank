import { contentLabels } from '@/db/schema';
import ContentLabelsRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';
import { ContentLabel } from '@/lib/recognition';

type ContentLabelInsert = typeof contentLabels.$inferInsert;

class ContentLabelsService {
  constructor(private readonly repository = new ContentLabelsRepository()) {}

  async getByContentId(contentId: string) {
    return withAuth(async () => this.repository.findByContentId(contentId), []);
  }

  async getAll(params: QueryOptions<typeof contentLabels>) {
    return withAuth(async () => this.repository.query(params), []);
  }

  async create(data: ContentLabelInsert) {
    return withAuth(async () => this.repository.create(data), ['contributor']);
  }

  async createMany(contentId: string, labels: ContentLabel[]) {
    return withAuth(async () => {
      const labelsToInsert: ContentLabelInsert[] = labels.map((label) => ({
        contentId,
        name: label.name,
        confidence: Math.round(label.confidence * 100),
        instances: label.instances,
        parents: label.parents,
        aliases: label.aliases,
        categories: label.categories,
      }));

      const results = [];
      for (const label of labelsToInsert) {
        const result = await this.repository.create(label);
        results.push(result);
      }
      return results;
    }, ['contributor']);
  }

  async deleteByContentId(contentId: string) {
    return withAuth(
      async () => this.repository.deleteByContentId(contentId),
      ['contributor']
    );
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const contentLabelsService = serviceWrapper(
  ContentLabelsService,
  'ContentLabels'
);
