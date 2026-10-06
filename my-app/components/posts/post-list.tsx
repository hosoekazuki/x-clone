import { PostItem } from '@/components/posts/post-item';
import type { TimelinePost } from '@/lib/posts/data';

type PostListProps = {
    posts: TimelinePost[];
    currentUserId: number;
}

// 投稿リストコンポーネント
export function PostList({ posts, currentUserId }: PostListProps){
    if(posts.length === 0){
        return <p>投稿はまだありません</p>;
    }
    return (
        <ul>
            {posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    isOwner={post.author.id === currentUserId}
                />
            ))}
        </ul>
    )
}