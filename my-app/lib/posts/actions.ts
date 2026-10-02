'use server';

import { DrizzleQueryError } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { validatePost } from '@/lib/validation';

export type CreatePostState = {
    errors?: {
        content?: string;
    };
    message?: string;
    values?: {
        content?: string;
    };
};

export async function createPost(
    _prevState: CreatePostState,
    formData: FormData,
): Promise<CreatePostState>{
    // ログインしているか確認する（未ログインなら/loginへ移動）
    const user = await requireUser();

    const values = {
        content: String(formData.get('content') ?? ''),
    };
    const result = validatePost(formData);
    if(!result.success){
        return { errors: result.errors, values };
    }

    try{
        await db.insert(posts).values({
            userId: user.id,
            content: result.data.content,
        });    
    }catch(error){
        console.error('投稿に失敗しました', error instanceof DrizzleQueryError ? error.cause : error);
        return { message: '投稿に失敗しました', values };
    }
    revalidatePath('/'); // 投稿後にトップページを再検証する
    return {}; // 投稿に成功した場合は空のオブジェクトを返す
}