'use server';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/session';
import { followUser, unfollowUser } from '@/lib/follows/data';
import { DrizzleQueryError } from 'drizzle-orm';

export async function follow(followingId: unknown): Promise<void> {
    const user = await requireUser();
    if(typeof followingId !== 'number' || !Number.isSafeInteger(followingId) || followingId <=0){
        return;
    }
    if(user.id === followingId){
        return;
    }
    try{
        await followUser(user.id, followingId);
    }catch(error){
        console.error('フォローに失敗しました', error instanceof DrizzleQueryError ? error.cause : error);
        return;
    }
    revalidatePath(`/[username]`, 'page'); // フォロー後にユーザー詳細ページを再検証する
}
    
export async function unfollow(followingId: unknown): Promise<void> {
    const user = await requireUser();
    if(typeof followingId !== 'number' || !Number.isSafeInteger(followingId) || followingId <=0){
        return;
    }
    if(user.id === followingId){
        return;
    }
    try{
        await unfollowUser(user.id, followingId);
    }catch(error){
        console.error('フォロー解除に失敗しました', error instanceof DrizzleQueryError ? error.cause : error);
        return;
    }
    revalidatePath(`/[username]`, 'page'); // フォロー解除後にユーザー詳細ページを再検証する
}