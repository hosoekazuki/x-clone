// ログイン時のフォーム入力を行う部分
'use client';

import { useActionState } from 'react';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@/lib/validation';
import { login, type LoginState } from './actions';

const initialState: LoginState = {};

export function LoginForm(){
    const [state, formAction, pending] = useActionState(login, initialState);

    return (
        <form action={formAction}>
            <div>
                <label htmlFor="email">メールアドレス</label>
                <input 
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={EMAIL_MAX_LENGTH}
                    defaultValue={state.values?.email}
                    aria-invalid={!!state.errors?.email}
                    aria-describedby={state.errors?.email ? 'email-error' : undefined}
                />
                {state.errors?.email && <p id="email-error">{state.errors.email}</p>}
            </div>

            <div>
                <label htmlFor="password">パスワード</label>
                <input 
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    maxLength={PASSWORD_MAX_LENGTH}
                    aria-invalid={!!state.errors?.password}
                    aria-describedby={state.errors?.password ? 'password-error' : undefined}
                />
                {state.errors?.password && <p id="password-error">{state.errors.password}</p>}
            </div>

            {state.message && <p role="alert">{state.message}</p>}
            <button type="submit" disabled={pending}>
                {pending ? 'ログイン中...' : 'ログイン'}
            </button>
        </form>
    );
}