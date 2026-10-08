import 'server-only';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { likes } from '@/db/schema';

// 新しくいいねした時の処理
export async function likePost(userId: number, postId: number): Promise<void>{
    await db.insert(likes).values({ userId, postId }).onConflictDoNothing();
}

// いいねを外した時の処理
export async function unlikePost(userId: number, postId: number): Promise<void>{
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
}
