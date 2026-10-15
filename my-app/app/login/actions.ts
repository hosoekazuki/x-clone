'use server';

import { DrizzleQueryError, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { validateLogin } from '@/lib/validation';
import { createSession } from '@/lib/auth/session';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request-ip';

// IP単位: 1つの発信元からのログイン連打（DoS・パスワードスプレー）を抑える
const IP_MAX = 20;
const IP_WINDOW_MS = 60 * 1000; // 1分
// アカウント単位: 特定メール宛の総当たりを抑える
const EMAIL_MAX = 5;
const EMAIL_WINDOW_MS = 60 * 1000; // 1分

const TOO_MANY_REQUESTS_MESSAGE = '試行回数が多すぎます。しばらくしてから再度お試しください';

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

    // レート制限: IP単位 → アカウント単位 の順にチェックする。
    // どちらも「重い scrypt を走らせる前」に弾くことで、DoS対策にもなる。
    const ip = await getClientIp();
    if (!rateLimit(`login:ip:${ip}`, IP_MAX, IP_WINDOW_MS).allowed) {
        return { message: TOO_MANY_REQUESTS_MESSAGE, values };
    }
    if (!rateLimit(`login:email:${email}`, EMAIL_MAX, EMAIL_WINDOW_MS).allowed) {
        return { message: TOO_MANY_REQUESTS_MESSAGE, values };
    }

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