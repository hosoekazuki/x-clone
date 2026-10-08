'use client';

import { like, unlike } from '@/lib/likes/actions';
import { useOptimistic } from 'react';

type LikeButtonProps = {
    postId: number;
    likeCount: number;
    likedByMe: boolean;
};

// いいねボタンコンポーネント
export function LikeButton({ postId, likeCount, likedByMe }: LikeButtonProps){
    const [optimistic, setOptimistic] = useOptimistic({ liked: likedByMe, count: likeCount });
    async function toggleLike(){
        const nextLiked = !optimistic.liked;
        // optimistic UIの更新
        setOptimistic({
            liked: nextLiked,
            count: nextLiked ? optimistic.count - 1 : optimistic.count + 1,
        });
        // サーバーで処理するために、likeまたはunlike関数を呼び出す
        await (likedByMe ? unlike : like)(postId);
    }
    return (
        <form action={toggleLike}>
            <button
                type="submit"
                className="flex items-center gap-1 text-sm font-bold text-gray-500 transition-colors hover:text-gray-600"
            >
                {optimistic.liked ? '♥' : '♡'} {optimistic.count}
            </button>
        </form>
    );
}