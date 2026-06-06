import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

import { serial, jsonb, integer } from 'drizzle-orm/pg-core'

export const colleges = pgTable('colleges', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state').notNull(),
  location: text('location'),
  type: text('type'),
  tuition: text('tuition'),
  acceptanceRate: text('acceptanceRate'),
  satRange: text('satRange'),
  actRange: text('actRange'),
  specializations: text('specializations').array(),
  description: text('description'),
  website: text('website'),
  ranking: integer('ranking'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  email: text('email').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  state: text('state'),
  interests: text('interests').array(),
  gpa: text('gpa'),
  satScore: text('satScore'),
  actScore: text('actScore'),
  collegePreferences: text('collegePreferences'),
  status: text('status').default('new'),
  zapierWebhookSent: boolean('zapierWebhookSent').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const chatInteractions = pgTable('chatInteractions', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  leadId: text('leadId'),
  message: text('message').notNull(),
  response: text('response').notNull(),
  context: jsonb('context'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
