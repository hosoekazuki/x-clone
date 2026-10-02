import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './login-form';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';

export const metadata: Metadata = {
    title: 'login',
};

export default async function LoginPage(){
    if(await validateSession()){
        redirect('/');
    }
    return (
        <main>
            <h1>ログイン</h1>
            <LoginForm />
            <p>
                アカウントをお持ちでない方は<Link href="/signup">こちら</Link>から新規登録してください。
            </p>
        </main>
    );
}
