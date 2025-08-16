import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  varchar,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { nanoid } from 'nanoid';

export const userRoles = ['user', 'contributor', 'moderator', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name'),
  role: text('role', { enum: userRoles }).notNull().default('user'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
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
    credentialID: text('credential_id').notNull().unique(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('provider_account_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credential_device_type').notNull(),
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const locations = pgTable('locations', {
  id: varchar('id', { length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  placeId: text('place_id').unique().notNull(),
  name: text('name').notNull(),
  formattedAddress: text('formatted_address'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
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

export const content = pgTable('content', {
  id: varchar('id', { length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  type: text('type', { enum: contentTypes }).notNull().default('image'),
  fileName: text('file_name'),
  locationId: varchar('location_id', { length: 21 }).references(
    () => locations.id
  ),
  status: text('status', { enum: contentStatuses })
    .notNull()
    .default('published'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
});
