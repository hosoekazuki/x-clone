// 認証に関するserver action (複数の画面から使うもの)
'use server';

import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/auth/session';

// ログアウトする
export async function logout(): Promise<void>{
    await deleteSession();
    redirect('/login');
}
