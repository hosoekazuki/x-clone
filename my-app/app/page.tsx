import { requireUser } from '@/lib/auth/session';
import { PostForm } from './post-form';
import { getTimelinePosts } from '@/lib/posts/data';
import { PostList } from '@/components/posts/post-list';
import { Header } from '@/components/layout/header';
import { ProfileLink } from '@/components/layout/profile-link';

export default async function HomePage(){
  const user = await requireUser();
  const posts = await getTimelinePosts(user.id);
  return (
    <>
      <Header username={user.username}>
        <ProfileLink username={user.username} />
      </Header>
      <main>
        <h1 className="border-b border-gray-200 px-4 py-3 text-xl font-bold">ホーム</h1>
        <PostForm />
        <PostList posts={posts} currentUserId={user.id} />
      </main>
    </>
  );
}