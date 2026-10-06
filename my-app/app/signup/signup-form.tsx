// 新規登録時にフォームを入力する部分
'use client';

import { useActionState } from 'react';
import { signup, type SignupState } from './actions';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';

const initialState: SignupState = {};

export function SignupForm(){
    const [state, formAction, pending ] = useActionState(signup, initialState);

    return (
        <form action={formAction} className="mt-6 space-y-4">
                <TextField
                    id="username"
                    name="username"
                    label="ユーザー名"
                    type="text"
                    autoComplete="username"
                    required
                    minLength={4}
                    maxLength={15}
                    pattern="[a-zA-Z0-9_]+"
                    defaultValue={state.values?.username}
                    error={state.errors?.username}
                />

                <TextField
                    id="email"
                    name="email"
                    label="メールアドレス"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    defaultValue={state.values?.email}
                    error={state.errors?.email}
                />

                <TextField
                    id="password"
                    name="password"
                    label="パスワード"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={64}
                    error={state.errors?.password}

                />

            {state.message && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
            <Button type="submit" disabled={pending} fullWidth>
                {pending ? '登録中...' : '登録'}
            </Button>
        </form>
    )
}
