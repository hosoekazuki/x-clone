// ログイン時のフォーム入力を行う部分
'use client';

import { useActionState } from 'react';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@/lib/validation';
import { login, type LoginState } from './actions';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';

const initialState: LoginState = {};

export function LoginForm(){
    const [state, formAction, pending] = useActionState(login, initialState);

    return (
        <form action={formAction} className="mt-6 space-y-4">
            <TextField
                id="email"
                name="email"
                label="メールアドレス"
                type="email"
                autoComplete="email"
                required
                maxLength={EMAIL_MAX_LENGTH}
                defaultValue={state.values?.email}
                error={state.errors?.email}
            />

            <TextField
                id="password"
                name="password"
                label="パスワード"
                type="password"
                autoComplete="current-password"
                required
                maxLength={PASSWORD_MAX_LENGTH}
                error={state.errors?.password}
            />
            {state.message && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
            <Button type="submit" disabled={pending} fullWidth>
                {pending ? 'ログイン中...' : 'ログイン'}
            </Button>
        </form>
    );
}

