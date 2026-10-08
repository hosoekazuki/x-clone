import { sql } from 'drizzle-orm';
import { index, check, integer, pgTable, varchar, timestamp, text, primaryKey } from 'drizzle-orm/pg-core';

const timestamps = {
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
};

export const users = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 15 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: text().notNull(),
    image: text(),
    ...timestamps,
});

export const sessions = pgTable('sessions', {
    id: text().primaryKey(),
    userId: integer().notNull().references(() => users.id, { onDelete: 'cascade'}),
    expiresAt: timestamp({withTimezone: true}).notNull(),
    createdAt: timestamp({withTimezone: true}).notNull().defaultNow(),
});

export const posts = pgTable('posts', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().references(() => users.id, { onDelete: 'cascade'}),
    content: varchar({ length: 280 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [
        check('posts_content_not_blank', sql`char_length(btrim(${t.content})) > 0`),
        index('posts_user_id_created_at_idx').on(t.userId, t.createdAt)
    ],
);

export const follows = pgTable('follows', {
    followerId: integer().notNull().references(() => users.id, { onDelete: 'cascade'}),
    followingId: integer().notNull().references(() => users.id, { onDelete: 'cascade'}),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [
        primaryKey({ columns: [t.followerId, t.followingId] }),
        index('follows_following_id_idx').on(t.followingId),
        check('follows_no_self_follow', sql`${t.followerId} <> ${t.followingId}`),
    ]
)