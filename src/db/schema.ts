import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';

export const userRoles = ['user', 'contributor', 'moderator', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];

export const users = sqliteTable('users', {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text(),
  role: text({ enum: userRoles }).notNull().default('user'),
  email: text().unique(),
  emailVerified: integer({ mode: 'timestamp_ms' }),
  image: text(),
});

export const accounts = sqliteTable(
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

export const sessions = sqliteTable('sessions', {
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer({ mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verification_tokens',
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: integer({ mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = sqliteTable(
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
    credentialBackedUp: integer({
      mode: 'boolean',
    }).notNull(),
    transports: text(),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const locations = sqliteTable('locations', {
  id: text({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  placeId: text().unique().notNull(),
  name: text().notNull(),
  formattedAddress: text(),
  createdAt: integer({ mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer({ mode: 'timestamp' }),
});

export const contentTypes = ['image', 'video'] as const;
export type ContentType = (typeof contentTypes)[number];

export const contentStatuses = [
  'draft',
  'pending',
  'published',
  'rejected',
  'archived',
] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export const content = sqliteTable('content', {
  id: text({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  type: text({ enum: contentTypes }).notNull().default('image'),
  fileName: text(),
  locationId: text().references(() => locations.id),
  status: text({ enum: contentStatuses }).notNull().default('published'),
  createdAt: integer({ mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer({ mode: 'timestamp' }),
});
