import { logout } from '@/lib/auth/actions';

type HeaderProps = {
    username: string;
}

// ヘッダーコンポーネント
export function Header({ username }: HeaderProps){
    return(
        <header>
            <p>ようこそ、{username}さん</p>
            <form action={logout}>
                <button type="submit">ログアウト</button>
            </form>
        </header>
    );
}