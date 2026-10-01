// 新規登録されたデータが送信されたときの処理
'use server';

import { DrizzleQueryError } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { DatabaseError } from 'pg';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { validateSignup } from '@/lib/validation';


// サーバーからフォームに返す情報の形
export type SignupState = {
    errors?: {
        username?: string;
        email?: string;
        password?: string;
    };
    message?: string;
    values?: {
        username?: string;
        email?: string;
    };
};

function getUniqueViolationField(error: unknown): 'username' | 'email' | undefined{
    const cause = error instanceof DrizzleQueryError ? error.cause : error;
    if(!(cause instanceof DatabaseError) || cause.code !== '23505'){
        return undefined;
    }
    if(cause.constraint === 'users_username_unique') return 'username';
    if(cause.constraint === 'users_email_unique') return 'email';
    return undefined;
}

export async function signup(
    _prevState: SignupState,
    formData: FormData,
): Promise<SignupState> {
    const values = {
        username: String(formData.get('username') ?? ''),
        email: String(formData.get('email') ?? ''),
    };

    const result = validateSignup(formData);
    if(!result.success){
        return {errors: result.errors, values}; 
    }
    const { username, email, password } = result.data;

    try{
        const passwordHash = await hashPassword(password);
        await db.insert(users).values({
            username, email, passwordHash
        });
    }catch(error){
        const field = getUniqueViolationField(error);
        if(field === 'username'){
            return { errors: { username: 'This username is already taken' }, values };
        }
        if(field === 'email'){
            return { errors: { email: 'This email is already taken' }, values };
        }
        console.error('新規登録に失敗しました', error instanceof DrizzleQueryError ? error.cause : error);
        return { message: '登録に失敗しました', values};
    }
    redirect('/login');
}