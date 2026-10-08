import 'server-only';
import { and, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { follows } from '@/db/schema';

// 新しくフォローした時の処理
export async function followUser(followerId: number, followingId: number): Promise<void> {
    await db.insert(follows).values({ followerId, followingId }).onConflictDoNothing();
}

// フォローを外した時の処理
export async function unfollowUser(followerId: number, followingId: number): Promise<void> {
    await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
}

// フォローしているかどうかを確認する
export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const rows = await db
        .select({ followerId: follows.followerId })
        .from(follows)
        .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
        .limit(1);
    return rows.length > 0;
}

//  ユーザーのフォロー数とフォロワー数を取得する
export async function getFollowerCounts(userId: number): Promise<{ following: number; followers: number }> {
    const [followingRow] = await db
        .select({ value: count() })
        .from(follows)
        .where(eq(follows.followerId, userId));

    const [followerRow] = await db
        .select({ value: count() })
        .from(follows)
        .where(eq(follows.followingId, userId));
    
    return {
        following: followingRow.value,
        followers: followerRow.value,
    }
}