// 新規登録画面
import type { Metadata } from 'next';
import { SignupForm } from './signup-form';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';
import Link from 'next/link';


export const metadata: Metadata = {
    title: 'signup',
};

export default async function SignupPage(){
    if(await validateSession()){
        redirect('/');
    }
    return (
        <main className="px-4 py-8">
            <h1 className="text-2xl font-bold">サインアップ</h1>
            <p className="text-gray-600">新しいアカウントを作成してください。</p>
            <SignupForm />
            <p className="mt-6 text-sm text-gray-600">
                すでにアカウントをお持ちの方は
                <Link href="/login" className="font-bold text-gray-900 underline">こちら</Link>
                からログインしてください。
            </p>
        </main>
    );
}