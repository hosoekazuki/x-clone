'use server';

import { DrizzleQueryError } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/session';
import { validatePost } from '@/lib/validation';
import { insertPost } from '@/lib/posts/data';

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
        await insertPost(user.id, result.data.content);
    }catch(error){
        console.error('投稿に失敗しました', error instanceof DrizzleQueryError ? error.cause : error);
        return { message: '投稿に失敗しました', values };
    }
    revalidatePath('/'); // 投稿後にトップページを再検証する
    return {}; // 投稿に成功した場合は空のオブジェクトを返す
}
