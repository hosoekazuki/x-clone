import { requireUser } from '@/lib/auth/session';
import { logout } from '@/lib/auth/actions';
import { PostForm } from './post-form';

export default async function HomePage(){
  const user = await requireUser();
  return (
    <main>
      <h1>ホーム</h1>
      <p>ようこそ、{user.username}さん</p>
      <form action={logout}>
        <button type="submit">ログアウト</button>
      </form>
      <PostForm />
    </main>
  );
}