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
        <li>
            <p>{post.author.username}</p>
            <p style={{ whiteSpace: 'pre-wrap'}}>{post.content}</p>
            <time dateTime={post.createdAt.toISOString()}>
                {dateFormatter.format(post.createdAt)}
            </time>
            {isOwner && (
                <form action={deletePost.bind(null, post.id)}>
                    <button type="submit">削除</button>
                </form>
            )}
        </li>
    )
}