import { logout } from '@/lib/auth/actions';

type HeaderProps = {
    username: string;
}

// ヘッダーコンポーネント
export function Header({ username }: HeaderProps){
    return(
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-600">ようこそ、{username}さん</p>
            <form action={logout}>
                <button 
                    type="submit"
                    className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold hover:bg-gray-100"
                >
                    ログアウト
                </button>
            </form>
        </header>
    );
}