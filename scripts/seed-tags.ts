import { config } from 'dotenv';
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL not set. Create .env.local with DATABASE_URL=...',
  );
  process.exit(1);
}

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/db/schema';
import { tags } from '../src/db/schema';

const TAGS: Array<{ name: string; slug: string }> = [
  { name: 'Mountainscape', slug: 'mountainscape' },
  { name: 'Waterfall', slug: 'waterfall' },
  { name: 'Highland Plateau', slug: 'highland-plateau' },
  { name: 'Mountain Pass', slug: 'mountain-pass' },
  { name: 'River Valley', slug: 'river-valley' },
  { name: 'Rock Formations', slug: 'rock-formations' },
  { name: 'Grasslands', slug: 'grasslands' },
  { name: 'Pony Trekking', slug: 'pony-trekking' },
  { name: 'High Altitude Hiking', slug: 'high-altitude-hiking' },
  { name: 'Rock Climbing', slug: 'rock-climbing' },
  { name: 'Ski Touring', slug: 'ski-touring' },
  { name: 'Fly Fishing', slug: 'fly-fishing' },
  { name: 'Cultural Tour', slug: 'cultural-tour' },
  { name: 'Wildlife Watching', slug: 'wildlife-watching' },
  { name: 'Basotho Blanket', slug: 'basotho-blanket' },
  { name: 'Basotho Hat', slug: 'basotho-hat' },
  { name: 'Traditional Dance', slug: 'traditional-dance' },
  { name: 'Herder Life', slug: 'herder-life' },
  { name: 'Village Life', slug: 'village-life' },
  { name: 'Rondavel Homestead', slug: 'rondavel-homestead' },
  { name: 'Stone Architecture', slug: 'stone-architecture' },
  { name: 'Handicrafts', slug: 'handicrafts' },
  { name: 'Local Cuisine', slug: 'local-cuisine' },
  { name: 'Traditional Music', slug: 'traditional-music' },
  { name: 'Wool and Mohair', slug: 'wool-and-mohair' },
  { name: 'Sunrise', slug: 'sunrise' },
  { name: 'Sunset', slug: 'sunset' },
  { name: 'Alpine Snow', slug: 'alpine-snow' },
  { name: 'Mountain Mist', slug: 'mountain-mist' },
  { name: 'Dramatic Clouds', slug: 'dramatic-clouds' },
  { name: 'Rainbow', slug: 'rainbow' },
  { name: 'Golden Light', slug: 'golden-light' },
  { name: 'Night Sky', slug: 'night-sky' },
  { name: 'Wildflowers', slug: 'wildflowers' },
  { name: 'Mountain Birds', slug: 'mountain-birds' },
  { name: 'Antelope', slug: 'antelope' },
  { name: 'Livestock', slug: 'livestock' },
  { name: 'Drone Aerial', slug: 'drone-aerial' },
  { name: 'Portrait', slug: 'portrait' },
  { name: 'Long Exposure', slug: 'long-exposure' },
];

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema, casing: 'snake_case' });

async function seedTags() {
  const existing = await db.query.tags.findMany({ columns: { slug: true } });
  const existingSet = new Set(existing.map((t) => t.slug));
  const toInsert = TAGS.filter((t) => !existingSet.has(t.slug));
  if (toInsert.length > 0) {
    await db.insert(tags).values(toInsert);
    console.log(`Inserted ${toInsert.length} new tags`);
  } else {
    console.log('No new tags to insert');
  }
  console.log(`Total distinct prepared tags: ${TAGS.length}`);
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
