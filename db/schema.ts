import { sqliteTable,text } from 'drizzle-orm/sqlite-core';
export const responses=sqliteTable('responses',{id:text('id').primaryKey(),name:text('name').notNull(),attendance:text('attendance',{enum:['attending','declining']}).notNull(),dietary:text('dietary').notNull(),song:text('song').notNull(),createdAt:text('created_at').notNull()});
