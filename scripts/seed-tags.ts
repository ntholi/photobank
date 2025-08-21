import { config } from 'dotenv';
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL not set. Create .env.local with DATABASE_URL=...'
  );
  process.exit(1);
}

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/db/schema';
import { tags } from '../src/db/schema';

// Fixed non-location tag set (slugs + human names)
const TAGS: Array<{ slug: string; name: string }> = [
  { slug: 'mountainscape', name: 'Mountainscape' },
  { slug: 'waterfall', name: 'Waterfall' },
  { slug: 'pony-trekking', name: 'Pony Trekking' },
  { slug: 'herder-life', name: 'Herder Life' },
  { slug: 'basotho-blanket', name: 'Basotho Blanket' },
  { slug: 'basotho-hat', name: 'Basotho Hat' },
  { slug: 'traditional-dance', name: 'Traditional Dance' },
  { slug: 'cultural-festival', name: 'Cultural Festival' },
  { slug: 'handicrafts', name: 'Handicrafts' },
  { slug: 'local-cuisine', name: 'Local Cuisine' },
  { slug: 'livestock', name: 'Livestock' },
  { slug: 'night-sky', name: 'Night Sky' },
  { slug: 'sunrise', name: 'Sunrise' },
  { slug: 'alpine-snow', name: 'Alpine Snow' },
  { slug: 'drone-aerial', name: 'Drone Aerial' },
  { slug: 'panoramic', name: 'Panoramic' },
  { slug: 'long-exposure', name: 'Long Exposure' },
  { slug: 'silhouette', name: 'Silhouette' },
  { slug: 'adventure', name: 'Adventure' },
  { slug: 'serenity', name: 'Serenity' },
  { slug: 'eco-tourism', name: 'Eco Tourism' },
  { slug: 'heritage', name: 'Heritage' },
];

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema, casing: 'snake_case' });

async function seedTags() {
  for (const tag of TAGS) {
    const existing = await db.query.tags.findFirst({
      where: (t, { eq }) => eq(t.slug, tag.slug),
      columns: { id: true },
    });
    if (!existing) {
      await db.insert(tags).values({ name: tag.name, slug: tag.slug });
    }
  }
}

seedTags()
  .then(() => {
    console.log('Tag seeding complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
