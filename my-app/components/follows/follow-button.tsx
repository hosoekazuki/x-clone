import { follow, unfollow } from '@/lib/follows/actions';

type FollowButtonProps = {
    userId: number;
    isFollowing: boolean;
};

export function FollowButton({ userId, isFollowing }: FollowButtonProps) {
    const action = isFollowing ? unfollow : follow;
    return (
        <form action={action.bind(null, userId)}>
            <button
                type="submit"
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold hover:bg-gray-100"
            >
                {isFollowing ? 'フォロー中' : 'フォローする'}
            </button>
        </form>
    );
}