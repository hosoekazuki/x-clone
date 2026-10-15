// 認証に関するserver action (複数の画面から使うもの)
'use server';

import { redirect } from 'next/navigation';
import { deleteAllSessions, deleteSession, requireUser } from '@/lib/auth/session';

// ログアウトする
export async function logout(): Promise<void>{
    await deleteSession();
    redirect('/login');
}

// 全端末からログアウトする
export async function logoutAll(): Promise<void>{
    const user = await requireUser();
    await deleteAllSessions(user.id);
    redirect('/login');
}
