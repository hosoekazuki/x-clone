// セッションの作成・確認・削除を行うためのモジュール
import 'server-only'; 
import { createHash, randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { redirect } from 'next/navigation';
// テーブルの情報を取得するためにdbをインポート
import { db } from '@/db';
import { sessions, users } from '@/db/schema';

const SESSION_TOKEN_BYTES = 32;
const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30日

// 推測できないランダムなトークンを作る
function generateSessionToken(): string{
    return randomBytes(SESSION_TOKEN_BYTES).toString('base64url');
}

// トークンをハッシュ化する
function hashSessionToken(token: string): string{
    return createHash('sha256').update(token).digest('hex');
}

// ログイン成功時に呼ぶ：セッションをDBに保存して、クッキーにトークンをセットする
export async function createSession(userId: number): Promise<void>{
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await db.insert(sessions).values({
        id: hashSessionToken(token),
        userId,
        expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
    });
}

// 画面などに渡して良いユーザー情報をまとめた型
export type SessionUser = {
    id: number;
    username: string;
    image: string | null;
}

// cookieのトークンを確認し、ログイン中のユーザーを返す。
export const validateSession = cache(async (): Promise<SessionUser | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if(!token) return null;

    const sessionId = hashSessionToken(token);
    const [row] = await db
        .select({
            expiresAt: sessions.expiresAt,
            user:{
                id: users.id,
                username: users.username,
                image: users.image,
            },
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId))
        .limit(1);

    if(!row){
        return null;
    }
    if(row.expiresAt.getTime() <= Date.now()){
        await db.delete(sessions).where(eq(sessions.id, sessionId));
        return null;
    }
    return row.user;
});

// ログアウト時に呼ぶ。DBのセッションとクッキーの両方を削除する。
export async function deleteSession(): Promise<void>{
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if(token){
        await db.delete(sessions).where(eq(sessions.id, hashSessionToken(token)));
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
}

// ログイン必須のページやserver actionで呼ぶ：未ログインなら/loginにリダイレクトする
export async function requireUser(): Promise<SessionUser>{
    const user = await validateSession();
    if(!user){
        redirect('/login');
    }
    return user;
}