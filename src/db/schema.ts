import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  varchar,
  pgEnum,
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

export const content = pgTable('content', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  type: contentTypeEnum().notNull().default('image'),
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
