// 投稿に関するDB操作をまとめたファイル
import 'server-only';
import { desc, eq } from 'drizzle-orm';
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

// 投稿を保存する。
export async function insertPost(userId: number, content: string): Promise<void> {
    await db.insert(posts).values({ userId, content });
}
