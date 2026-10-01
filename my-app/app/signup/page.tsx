// 新規登録画面
import type { Metadata } from 'next';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
    title: 'signup',
};

export default function SignupPage(){
    return (
        <div>
            <h1>Signup</h1>
            <SignupForm />
        </div>
    );
}