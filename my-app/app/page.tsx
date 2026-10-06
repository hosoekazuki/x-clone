import { requireUser } from '@/lib/auth/session';
import { logout } from '@/lib/auth/actions';
import { PostForm } from './post-form';
import { getTimelinePosts } from '@/lib/posts/data';
import { deletePost } from '@/lib/posts/actions';

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default async function HomePage(){
  const user = await requireUser();
  const posts = await getTimelinePosts();
  return (
    <main>
      <h1>ホーム</h1>
      <p>ようこそ、{user.username}さん</p>
      <form action={logout}>
        <button type="submit">ログアウト</button>
      </form>
      <PostForm />
      {posts.length === 0 ? (
        <p>投稿はまだありません</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <p>{post.author.username}</p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
              <time dateTime={post.createdAt.toISOString()}>
                {dateFormatter.format(post.createdAt)}
              </time>
              {post.author.id === user.id && (
                <form action={deletePost.bind(null, post.id)}>
                  <button type="submit">削除</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}