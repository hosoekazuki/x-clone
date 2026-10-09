import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { getUserByUsername } from '@/lib/users/data';
import { getUserPosts } from '@/lib/posts/data';
import { Header } from '@/components/layout/header';
import { PostList } from '@/components/posts/post-list';
import { HomeLink } from '@/components/layout/home-link';
import { getFollowerCounts, isFollowing } from '@/lib/follows/data';
import { FollowButton } from '@/components/follows/follow-button';
import { LoadMoreLink } from '@/components/posts/load-more-link';
import { parseCursor } from '@/lib/pagination/pagination';

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
    const counts = await getFollowerCounts(profileUser.id);
    const isOwnProfile = profileUser.id === currentUser.id;
    const following = isOwnProfile
        ? false
        : await isFollowing(currentUser.id, profileUser.id);

    const { cursor: rawCursor } = await props.searchParams;
    const cursor = parseCursor(rawCursor);
    const { posts, nextCursor } = await getUserPosts(profileUser.id, currentUser.id, cursor);
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
                    <p className="mt-2 text-gray-600">
                        <span className="font-bold text-gray-900">{counts.followers}</span> フォロワー
                        <span className="ml-4 font-bold text-gray-900">{counts.following}</span> フォロー中
                    </p>
                    {!isOwnProfile && (
                        <div className="mt-3">
                            <FollowButton userId={profileUser.id} isFollowing={following} />
                        </div>
                    )}
                </section>
                <PostList posts={posts} currentUserId={currentUser.id} />
                {nextCursor !== null && (
                    <LoadMoreLink href={`/${profileUser.username}?cursor=${nextCursor}`} />
                )}
            </main>
        </>
    )
}