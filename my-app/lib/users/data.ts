import 'server-only';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// ユーザー名からユーザー情報を取得する
export async function getUserByUsername(username: string) {
    const [user] = await db
        .select({
            id: users.id,
            username: users.username,
            image: users.image,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
    return user ?? null;
}