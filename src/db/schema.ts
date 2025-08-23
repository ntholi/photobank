import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  varchar,
  pgEnum,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { nanoid } from 'nanoid';

export const userRoleEnum = pgEnum('user_role', [
  'user',
  'contributor',
  'moderator',
  'admin',
]);
export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const users = pgTable('users', {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text(),
  role: userRoleEnum().notNull().default('user'),
  email: text().unique(),
  emailVerified: timestamp({ mode: 'date' }),
  image: text(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text().$type<AdapterAccountType>().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text(),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('sessions', {
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp({ mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  'authenticators',
  {
    credentialID: text().notNull().unique(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text().notNull(),
    credentialPublicKey: text().notNull(),
    counter: integer().notNull(),
    credentialDeviceType: text().notNull(),
    credentialBackedUp: boolean().notNull(),
    transports: text(),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const contentTypeEnum = pgEnum('content_type', ['image', 'video']);

export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'pending',
  'published',
  'rejected',
  'archived',
]);
export type ContentStatus = (typeof contentStatusEnum.enumValues)[number];

export const content = pgTable('content', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: contentTypeEnum().notNull().default('image'),
  description: text(),
  fileName: text(),
  s3Key: text().notNull(),
  thumbnailKey: text().notNull(),
  watermarkedKey: text().notNull(),
  fileSize: integer(),
  locationId: varchar({ length: 21 }).references(() => locations.id),
  status: contentStatusEnum().notNull().default('published'),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).$onUpdate(() => new Date()),
});

export const homeContent = pgTable('home_content', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  position: integer().notNull(),
  contentId: varchar({ length: 21 })
    .notNull()
    .references(() => content.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).$onUpdate(() => new Date()),
});

export const locations = pgTable('locations', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  placeId: text().unique().notNull(),
  name: text().notNull(),
  address: text(),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' }),
});

export const locationDetails = pgTable('location_details', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  locationId: varchar({ length: 21 })
    .notNull()
    .references(() => locations.id, { onDelete: 'cascade' })
    .unique(),
  coverContentId: varchar({ length: 21 }).references(() => content.id, {
    onDelete: 'set null',
  }),
  about: text(),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).$onUpdate(() => new Date()),
});

export const tags = pgTable('tags', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  name: text().notNull(),
  slug: text().unique().notNull(),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
});

export const contentTags = pgTable(
  'content_tags',
  {
    contentId: varchar({ length: 21 })
      .notNull()
      .references(() => content.id, { onDelete: 'cascade' }),
    tagId: varchar({ length: 21 })
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    confidence: integer().default(100),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.contentId, table.tagId] }),
  })
);

export const contentLabels = pgTable('content_labels', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  contentId: varchar({ length: 21 })
    .notNull()
    .references(() => content.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  confidence: integer().notNull(),
  instances:
    jsonb().$type<Array<{ boundingBox?: object; confidence?: number }>>(),
  parents: jsonb().$type<string[]>(),
  aliases: jsonb().$type<string[]>(),
  categories: jsonb().$type<string[]>(),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
});
