import { requireUser } from '@/lib/auth/session';
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
        <h1 className="border-b border-gray-200 px-4 py-3 text-xl font-bold">ホーム</h1>
        <PostForm />
        <PostList posts={posts} currentUserId={user.id} />
      </main>
    </>
  );
}