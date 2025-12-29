import { pgTable, text, uuid, bigint, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  audioUrl: text('audio_url').notNull(),
  duration: bigint('duration', { mode: 'number' }).notNull(),
  coverUrl: text('cover_url'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const playlists = pgTable('playlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const playlistSongs = pgTable('playlist_songs', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  playlistId: uuid('playlist_id').notNull().references(() => playlists.id),
  songId: uuid('song_id').notNull().references(() => songs.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const listeningHistory = pgTable('listening_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  songId: uuid('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  playedAt: timestamp('played_at').defaultNow(),
});