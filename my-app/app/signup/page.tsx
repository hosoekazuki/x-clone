// 新規登録画面
import type { Metadata } from 'next';
import { SignupForm } from './signup-form';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';


export const metadata: Metadata = {
    title: 'signup',
};

export default async function SignupPage(){
    if(await validateSession()){
        redirect('/');
    }
    return (
        <main>
            <div>
                <h1>Signup</h1>
                <SignupForm />
            </div>
        </main>
    );
}