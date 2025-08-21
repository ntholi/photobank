import { db } from '@/db';
import { count, eq, like, or, sql, SQL } from 'drizzle-orm';

import { PgColumn as Column, PgTable as Table } from 'drizzle-orm/pg-core';

type ModelInsert<T extends Table> = T['$inferInsert'];
type ModelSelect<T extends Table> = T['$inferSelect'];

const DEFAULT_PAGE_SIZE = 15;

export interface SortOptions<T extends Table> {
  column: keyof ModelSelect<T>;
  order?: 'asc' | 'desc';
}

export interface QueryOptions<T extends Table> {
  page?: number;
  size?: number;
  search?: string;
  searchColumns?: (keyof ModelSelect<T>)[];
  sort?: SortOptions<T>[];
  filter?: SQL;
}

class BaseRepository<
  T extends Table,
  PK extends keyof T & keyof ModelSelect<T>,
> {
  protected table: T;
  protected primaryKey: Column;

  constructor(table: T, primaryKey: Column) {
    this.table = table;
    this.primaryKey = primaryKey;
  }

  private getColumn<K extends keyof ModelSelect<T>>(key: K): Column {
    return (this.table as unknown as Record<string, Column>)[key as string];
  }

  async findFirst(): Promise<ModelSelect<T> | undefined> {
    return await db
      .select()
      .from(this.table as unknown as Table)
      .limit(1)
      .then(([result]) => result);
  }

  async findById(id: ModelSelect<T>[PK]): Promise<ModelSelect<T> | null> {
    const result = await db
      .select()
      .from(this.table as unknown as Table)
      .where(eq(this.primaryKey, id));
    return result.length > 0 ? result[0] : null;
  }

  async findAll(): Promise<ModelSelect<T>[]> {
    const result = await db.select().from(this.table as unknown as Table);
    return result;
  }

  protected buildQueryCriteria(options: QueryOptions<T>) {
    const {
      page = 1,
      size = DEFAULT_PAGE_SIZE,
      search,
      searchColumns = [],
      sort = [],
      filter,
    } = options;

    const offset = (page - 1) * size;

    let orderBy = sort.map((sortOption) => {
      const column = this.getColumn(sortOption.column);
      return sql`${column} ${sortOption.order === 'desc' ? sql`DESC` : sql`ASC`} `;
    });

    if (orderBy.length === 0 && 'created_at' in this.table) {
      const createdAt = (this.table as unknown as Record<string, Column>)[
        'created_at'
      ];
      if (createdAt) {
        orderBy = [sql`${createdAt} DESC`];
      }
    }

    let where: SQL | undefined;

    if (search && searchColumns.length > 0) {
      const searchCondition = or(
        ...searchColumns.map((column) =>
          like(this.getColumn(column as keyof ModelSelect<T>), `%${search}%`)
        )
      );

      where = filter ? sql`${searchCondition} AND ${filter}` : searchCondition;
    } else {
      where = filter;
    }

    return {
      orderBy,
      where,
      offset,
      limit: size,
    };
  }

  protected async createPaginatedResult<E extends ModelSelect<T>>(
    items: E[],
    criteria: {
      where?: SQL;
      limit?: number;
    }
  ) {
    const totalItems = await this.count(criteria.where);
    return {
      items,
      totalPages: Math.ceil(totalItems / (criteria.limit || DEFAULT_PAGE_SIZE)),
      totalItems,
    };
  }

  async query(options: QueryOptions<T>): Promise<{
    items: ModelSelect<T>[];
    totalPages: number;
    totalItems: number;
  }> {
    const { orderBy, where, offset, limit } = this.buildQueryCriteria(options);

    const items = await db
      .select()
      .from(this.table as unknown as Table)
      .orderBy(...orderBy)
      .where(where)
      .limit(limit)
      .offset(offset);

    return await this.createPaginatedResult(items, { where, limit });
  }

  async exists(id: ModelSelect<T>[PK]): Promise<boolean> {
    const [result] = await db
      .select({ count: count() })
      .from(this.table as unknown as Table)
      .where(eq(this.primaryKey, id))
      .limit(1);
    return result?.count > 0;
  }

  async create(entity: ModelInsert<T>): Promise<ModelSelect<T>> {
    const result = await db.insert(this.table).values(entity).returning();
    return (result as ModelSelect<T>[])[0];
  }

  async createMany(entities: ModelInsert<T>[]): Promise<ModelSelect<T>[]> {
    if (entities.length === 0) {
      return [];
    }
    const result = await db.insert(this.table).values(entities).returning();
    return result as ModelSelect<T>[];
  }

  async update(
    id: ModelSelect<T>[PK],
    entity: Partial<ModelInsert<T>>
  ): Promise<ModelSelect<T>> {
    const [updated] = (await db
      .update(this.table)
      .set(entity)
      .where(eq(this.primaryKey, id))
      .returning()) as ModelSelect<T>[];

    return updated;
  }

  async delete(id: ModelSelect<T>[PK]): Promise<void> {
    await db.delete(this.table).where(eq(this.primaryKey, id));
  }

  async deleteById(id: ModelSelect<T>[PK]): Promise<boolean> {
    const result = await db
      .delete(this.table)
      .where(eq(this.primaryKey, id))
      .returning();
    return (result as ModelSelect<T>[]).length > 0;
  }

  async updateById(id: ModelSelect<T>[PK], entity: Partial<ModelInsert<T>>) {
    const [updated] = (await db
      .update(this.table)
      .set(entity)
      .where(eq(this.primaryKey, id))
      .returning()) as ModelSelect<T>[];

    return updated;
  }

  async count(filter?: SQL): Promise<number> {
    const query = db
      .select({ count: count() })
      .from(this.table as unknown as Table);
    const [result] = await (filter ? query.where(filter) : query);
    return result?.count ?? 0;
  }

  async deleteAll(): Promise<void> {
    await db.delete(this.table);
  }
}

export default BaseRepository;
