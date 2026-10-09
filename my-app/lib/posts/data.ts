// 投稿に関するDB操作をまとめたファイル
import 'server-only';
import { and, desc, eq, sql, lt } from 'drizzle-orm';
import { db } from '@/db';
import { posts, users, likes } from '@/db/schema';

const PAGE_SIZE = 2; // タイムラインに表示する投稿の最大数

// タイムラインに表示する投稿を取得する
async function getPosts(currentUserId: number, cursor?: number, authorId?: number) {
    const rows = await db
        .select({
            id: posts.id,
            content: posts.content,
            createdAt: posts.createdAt,
            author: {
                id: users.id,
                username: users.username,
                image: users.image,
            },
            // 投稿のいいね数を取得する
            likeCount: sql<number>`(
                select count(*)::int from ${likes}
                where ${likes.postId} = ${posts.id}
            )`,
            // ログイン中のユーザーがこの投稿にいいねしているかどうかを取得する
            likedByMe: sql<boolean>`exists(
                select 1 from ${likes}
                where ${likes.userId} = ${currentUserId}
                and ${likes.postId} = ${posts.id}
            )`,
        })
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .where(and(
            authorId ? eq(posts.userId, authorId) : undefined,
            cursor ? lt(posts.id, cursor) : undefined
        ))
        .orderBy(desc(posts.id))
        .limit(PAGE_SIZE + 1); // ページングのために1件多く取得する

        const hasMore = rows.length > PAGE_SIZE;
        const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
        const nextCursor = hasMore ? page[page.length - 1].id : null;
        return { posts: page, nextCursor };

}

export function getTimelinePosts(currentUserId: number, cursor?: number) {
    return getPosts(currentUserId, cursor);
}

export function getUserPosts(authorId: number, currentUserId: number, cursor?: number) {
    return getPosts(currentUserId, cursor, authorId);
}

export type TimelinePost = Awaited<ReturnType<typeof getTimelinePosts>>['posts'][number];

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