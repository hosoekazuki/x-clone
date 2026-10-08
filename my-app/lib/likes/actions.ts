'use server';

import { DrizzleQueryError } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/session';
import { likePost, unlikePost } from '@/lib/likes/data';

// 投稿にいいねする
export async function like(postId: unknown): Promise<void>{
    const user = await requireUser();
    if(typeof postId !== 'number' || !Number.isSafeInteger(postId) || postId <=0){
        return;
    }
    try{
        await likePost(user.id, postId);
    }catch(error){
        console.error('いいねに失敗しました', error instanceof DrizzleQueryError ? error.cause : error);
        return;
    }
    revalidatePath('/');
    revalidatePath(`/[username]`, 'page'); // いいね後にユーザー詳細ページを再検証する
}

// 投稿のいいねを外す
export async function unlike(postId: unknown): Promise<void>{
    const user = await requireUser();
    if(typeof postId !== 'number' || !Number.isSafeInteger(postId) || postId <=0){
        return;
    }
    try{
        await unlikePost(user.id, postId);
    }catch(error){
        console.error('いいね解除に失敗しました', error instanceof DrizzleQueryError ? error.cause : error);
        return;
    }
    revalidatePath('/');
    revalidatePath(`/[username]`, 'page'); // いいね解除後にユーザー詳細ページを再検証する
}