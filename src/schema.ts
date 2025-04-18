import {
  pgTable,
  varchar,
  text,
  uuid,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Define task status enum
export const taskStatusEnum = pgEnum('task_status', ['pending', 'completed']);

// Define the tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  assignedUserId: uuid('assigned_user_id'),
  status: taskStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define the users table (for simulation purposes)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export type definitions for TypeScript
export type Task = typeof tasks.$inferSelect;
export type NewTask = {
  id?: string;
  title: string;
  description?: string;
  assignedUserId?: string;
  status?: 'pending' | 'completed';
};

export type User = typeof users.$inferSelect;
export type NewUser = {
  id?: string;
  name: string;
  email: string;
  role?: string;
};
