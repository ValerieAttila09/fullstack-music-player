import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/drizzle/schema.ts',
  out: './lib/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DATABASE_URL || (() => {
      throw new Error('SUPABASE_DATABASE_URL environment variable is required');
    })(),
  },
});