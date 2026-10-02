'use client';

import { useActionState } from 'react';
import { createPost, type CreatePostState } from '@/lib/posts/actions';

const initialState: CreatePostState = {};

export function PostForm(){
    const [state, formAction, pending] = useActionState(createPost, initialState);

    return (
        <form action={formAction}>
            <label htmlFor="content">投稿内容</label>
            <textarea
                id="content"
                name="content"
                rows={3}
                required
                placeholder="いまどうしてる？"
                defaultValue={state.values?.content}
                aria-invalid={!!state.errors?.content}
                aria-describedby={state.errors?.content ? 'content-error' : undefined}
            />
            {state.errors?.content && <p id="content-error">{state.errors.content}</p>}
            {state.message && <p role="alert">{state.message}</p>}  
            <button type="submit" disabled={pending}>
                {pending ? '投稿中...' : '投稿'}
            </button>
        </form>
    );
}
