import { logout } from '@/lib/auth/actions';

type HeaderProps = {
    username: string;
    children?: React.ReactNode;
}

// ヘッダーコンポーネント
export function Header({ username, children }: HeaderProps){
    return(
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-600">ようこそ、{username}さん</p>
            <div className="flex items-center gap-2">
                {children}
                <form action={logout}>
                    <button 
                        type="submit"
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold hover:bg-gray-100"
                    >
                        ログアウト
                    </button>
                </form>
            </div>
        </header>
    );
}