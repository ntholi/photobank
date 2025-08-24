import { contentTags, tags } from '@/db/schema';
import ContentTagRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type ContentTag = typeof contentTags.$inferInsert;

class ContentTagService {
  constructor(private readonly repository = new ContentTagRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(contentId: string, tagId: string) {
    return withAuth(async () => {
      return this.repository.getById(contentId, tagId);
    }, []);
  }

  async getAll(params: QueryOptions<typeof contentTags>) {
    return withAuth(async () => this.repository.query(params), ['all']);
  }

  async create(data: ContentTag) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(contentId: string, tagId: string, data: Partial<ContentTag>) {
    return withAuth(async () => {
      return this.repository.updateByCompositeId(contentId, tagId, data);
    }, []);
  }

  async delete(contentId: string, tagId: string) {
    return withAuth(async () => {
      return this.repository.deleteByCompositeId(contentId, tagId);
    }, []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async createContentTags(
    contentId: string,
    selectedTags: Array<{ tag: string; confidence: number }>
  ) {
    return withAuth(async () => {
      if (selectedTags.length === 0) {
        return [];
      }

      const tagNames = selectedTags.map((item) => item.tag);
      const tagRecords = await this.repository.findTagsByNames(tagNames);

      if (tagRecords.length === 0) {
        console.log('No matching tags found in database for:', tagNames);
        return [];
      }

      const contentTagsToInsert: ContentTag[] = tagRecords.map(
        (tag: typeof tags.$inferSelect) => {
          const selectedTag = selectedTags.find(
            (item) => item.tag === tag.name
          );
          return {
            contentId,
            tagId: tag.id,
            confidence: selectedTag?.confidence || 100,
          };
        }
      );

      return await this.repository.createMany(contentTagsToInsert);
    }, ['contributor']);
  }

  async getContentTags(contentId: string) {
    return withAuth(async () => {
      return this.repository.getContentTags(contentId);
    }, []);
  }

  async updateContentTags(
    contentId: string,
    selectedTags: Array<{ tag: string; confidence: number }>
  ) {
    return withAuth(async () => {
      await this.repository.deleteAllByContentId(contentId);

      if (selectedTags.length === 0) {
        return [];
      }

      const tagNames = selectedTags.map((item) => item.tag);
      const tagRecords = await this.repository.findTagsByNames(tagNames);

      if (tagRecords.length === 0) {
        console.log('No matching tags found in database for:', tagNames);
        return [];
      }

      const contentTagsToInsert: ContentTag[] = tagRecords.map(
        (tag: typeof tags.$inferSelect) => {
          const selectedTag = selectedTags.find(
            (item) => item.tag === tag.name
          );
          return {
            contentId,
            tagId: tag.id,
            confidence: selectedTag?.confidence || 100,
          };
        }
      );

      return await this.repository.createMany(contentTagsToInsert);
    }, ['contributor']);
  }
}

export const contentTagsService = serviceWrapper(
  ContentTagService,
  'ContentTag'
);
