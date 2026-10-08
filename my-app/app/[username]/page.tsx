import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { getUserByUsername } from '@/lib/users/data';
import { getUserPosts } from '@/lib/posts/data';
import { Header } from '@/components/layout/header';
import { PostList } from '@/components/posts/post-list';
import { HomeLink } from '@/components/layout/home-link';


const joinedFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
});

export default async function ProfilePage(props: PageProps<'/[username]'>){
    const { username } = await props.params;
    const currentUser = await requireUser();
    const profileUser = await getUserByUsername(username);
    if(!profileUser) notFound();
    const posts = await getUserPosts(profileUser.id);
    return (
        <>
            <Header username={currentUser.username}>
                <HomeLink />
            </Header>    
            <main>
                <section className="border-b border-gray-200 px-4 py-4">
                    <h1 className="text-xl font-bold">{profileUser.username}</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {joinedFormatter.format(profileUser.createdAt)}から利用しています。
                    </p>
                </section>
                <PostList posts={posts} currentUserId={currentUser.id} />
            </main>
        </>
    )
}