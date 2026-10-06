'use client';

import { useActionState } from 'react';
import { createPost, type CreatePostState } from '@/lib/posts/actions';
import { Button } from '@/components/ui/button';

const initialState: CreatePostState = {};

export function PostForm(){
    const [state, formAction, pending] = useActionState(createPost, initialState);

    return (
        <form action={formAction} className="border-b border-gray-200 px-4 py-3">
            <label htmlFor="content" className="sr-only">投稿内容</label>
            <textarea
                id="content"
                name="content"
                rows={3}
                required
                placeholder="いまどうしてる？"
                defaultValue={state.values?.content}
                aria-invalid={!!state.errors?.content}
                aria-describedby={state.errors?.content ? 'content-error' : undefined}
                className="block w-full resize-none rounded-lg border border-gray-200 p-3 text-lg placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
            />
            {state.errors?.content && (
                <p id="content-error" className="mt-1 text-sm text-red-600">
                    {state.errors.content}
                </p>
            )}
            {state.message && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                    {state.message}
                </p>
            )}  
            <div className="mt-2 flex justify-end">
                <Button type="submit" disabled={pending}>
                    {pending ? '投稿中...' : '投稿'}
                </Button>
            </div>
        </form>
    );
}
