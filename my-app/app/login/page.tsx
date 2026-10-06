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
        <main className="px-4 py-8">
            <h1 className="text-2xl font-bold">ログイン</h1>
            <LoginForm />
            <p className="mt-6 text-sm text-gray-600">
                アカウントをお持ちでない方は
                <Link href="/signup" className="font-bold text-gray-900 underline">こちら</Link>
                から新規登録してください。
            </p>
        </main>
    );
}
