import { requireUser } from '@/lib/auth/session';
import { logout } from '@/lib/auth/actions';
import { PostForm } from './post-form';
import { getTimelinePosts } from '@/lib/posts/data';
import { PostList } from '@/components/posts/post-list';
import { Header } from '@/components/layout/header';

export default async function HomePage(){
  const user = await requireUser();
  const posts = await getTimelinePosts();
  return (
    <>
      <Header username={user.username} />
      <main>
        <h1>ホーム</h1>
        <PostForm />
        <PostList posts={posts} currentUserId={user.id} />
      </main>
    </>
  );
}