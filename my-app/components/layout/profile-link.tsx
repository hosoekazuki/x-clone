import Link from "next/link";

export function ProfileLink({username}: {username: string}){
    return(
        <Link href={`/${username}`} className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold hover:bg-gray-100">
            プロフィール
        </Link>
    )
}