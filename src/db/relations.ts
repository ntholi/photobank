import { relations } from 'drizzle-orm';
import {
  accounts,
  authenticators,
  content,
  contentLabels,
  contentTags,
  homeContent,
  locationDetails,
  locations,
  sessions,
  tags,
  users,
} from './schema';

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  content: many(content),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  user: one(users, {
    fields: [content.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [content.locationId],
    references: [locations.id],
  }),
  tags: many(contentTags),
  labels: many(contentLabels),
  homeContent: many(homeContent),
  coverForLocationDetails: many(locationDetails, {
    relationName: 'coverContent',
  }),
}));

export const homeContentRelations = relations(homeContent, ({ one }) => ({
  content: one(content, {
    fields: [homeContent.contentId],
    references: [content.id],
  }),
}));

export const locationsRelations = relations(locations, ({ many, one }) => ({
  content: many(content),
  details: one(locationDetails, {
    fields: [locations.id],
    references: [locationDetails.locationId],
    relationName: 'location_details',
  }),
}));

export const locationDetailsRelations = relations(
  locationDetails,
  ({ one }) => ({
    location: one(locations, {
      fields: [locationDetails.locationId],
      references: [locations.id],
      relationName: 'location_details',
    }),
    coverContent: one(content, {
      fields: [locationDetails.coverContentId],
      references: [content.id],
      relationName: 'coverContent',
    }),
  })
);

export const tagsRelations = relations(tags, ({ many }) => ({
  contentTags: many(contentTags),
}));

export const contentTagsRelations = relations(contentTags, ({ one }) => ({
  content: one(content, {
    fields: [contentTags.contentId],
    references: [content.id],
  }),
  tag: one(tags, {
    fields: [contentTags.tagId],
    references: [tags.id],
  }),
}));

export const contentLabelsRelations = relations(contentLabels, ({ one }) => ({
  content: one(content, {
    fields: [contentLabels.contentId],
    references: [content.id],
  }),
}));
