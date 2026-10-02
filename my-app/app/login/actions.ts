'use server';

import { DrizzleQueryError, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { validateLogin } from '@/lib/validation';
import { createSession } from '@/lib/auth/session';

export type LoginState = {
    errors?: {
        email?: string;
        password?: string;
    };
    message?: string;
    values?: {
        email?: string;
    };
};

const INVALID_CREDENTIALS_MESSAGE = 'メールアドレスまたはパスワードが正しくありません';

// ユーザーがいない時にも同じ時間がかかるように、比較用のダミーのハッシュを作成する
let dummyHashPromise: Promise<string> | undefined;
function getDummyHash(): Promise<string>{
    dummyHashPromise ??= hashPassword('dummy-password-for-timing');
    return dummyHashPromise;
}

export async function login(
    _prevState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const values = {
        email: String(formData.get('email') ?? ''),
    };
    const result = validateLogin(formData);
    if(!result.success){
        return { errors: result.errors, values };
    }
    const { email, password } = result.data;

    try{
        const [user] = await db
            .select({ id: users.id, passwordHash: users.passwordHash })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        if(!user){
            await verifyPassword(password, await getDummyHash());
            return { message: INVALID_CREDENTIALS_MESSAGE, values };
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if(!isValid){
            return { message: INVALID_CREDENTIALS_MESSAGE, values };
        }
        await createSession(user.id);
    }catch (error){
        console.error('ログインに失敗しました。', error instanceof DrizzleQueryError ? error.cause : error);
        return { message: 'ログインに失敗しました。時間をおいて再度お試しください', values };
    }
    redirect('/');
}