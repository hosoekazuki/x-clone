import Link from "next/link";

export function LoadMoreLink({ href }: { href: string }) {
    return (
        <div className="flex justify-center py-4">
            <Link 
              href={href}
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold hover:bg-gray-100"
            >
              もっと見る
            </Link>
        </div>
    );
}