import { deletePost } from '@/lib/posts/actions';
import type { TimelinePost } from '@/lib/posts/data';

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    dateStyle: 'medium',
    timeStyle: 'short',
});

type PostItemProps = {
    post: TimelinePost;
    isOwner: boolean;
};

// 投稿アイテムコンポーネント
export function PostItem({ post, isOwner }: PostItemProps){
    return (
        <li className="border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
                <span className="font-bold">{post.author.username}</span>
                <time dateTime={post.createdAt.toISOString()} className="text-gray-500">
                    {dateFormatter.format(post.createdAt)}
                </time>
            </div>
            <p className="mt-1 whitespace-pre-wrap wrap-break-word">{post.content}</p>
            {isOwner && (
                <form action={deletePost.bind(null, post.id)} className="mt-2 flex justify-end">
                    <button
                        type="submit"
                        className="rounded-full px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                        削除
                    </button>
                </form>
            )}
        </li>
    )
}