import { drizzle } from 'drizzle-orm/libsql/web';

const db = drizzle({
  casing: 'snake_case',
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});

export { db };
