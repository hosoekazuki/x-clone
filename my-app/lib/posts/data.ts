// 投稿に関するDB操作をまとめたファイル
import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { posts, users } from '@/db/schema';

const TIMELINE_LIMIT = 50; // タイムラインに表示する投稿の最大数

// タイムラインに表示する投稿を取得する
export async function getTimelinePosts() {
    return db
        .select({
            id: posts.id,
            content: posts.content,
            createdAt: posts.createdAt,
            author: {
                id: users.id,
                username: users.username,
                image: users.image,
            },
        })
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .orderBy(desc(posts.createdAt), desc(posts.id))
        .limit(TIMELINE_LIMIT);
}

export type TimelinePost = Awaited<ReturnType<typeof getTimelinePosts>>[number];

// 投稿を保存する。
export async function insertPost(userId: number, content: string): Promise<void> {
    await db.insert(posts).values({ userId, content });
}

// 投稿を削除する
export async function deleteOwnPost(postId: number, userId: number): Promise<boolean> {
    const deleted = await db
        .delete(posts)
        .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
        .returning({ id: posts.id });
    return deleted.length > 0;
}