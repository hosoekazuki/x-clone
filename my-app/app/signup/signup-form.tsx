// 新規登録時にフォームを入力する部分
'use client';

import { useActionState } from 'react';
import { signup, type SignupState } from './actions';

const initialState: SignupState = {};

export function SignupForm(){
    const [state, formAction, pending ] = useActionState(signup, initialState);

    return (
        <form action={formAction}>
            <div>
                <label htmlFor="username">username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    minLength={4}
                    maxLength={15}
                    pattern="[a-zA-Z0-9_]+"
                    defaultValue={state.values?.username}
                    aria-invalid={!!state.errors?.username}
                    aria-describedby={state.errors?.username ? 'username-error' : undefined }
                />
                {state.errors?.username && <p id="username-error">{state.errors.username}</p>}
            </div>

            <div>
                <label htmlFor="email">email</label>
                <input 
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    defaultValue={state.values?.email}
                    aria-invalid={!!state.errors?.email}
                    aria-describedby={state.errors?.email ? 'email-error' : undefined}
                />
                {state.errors?.email && <p id="email-error">{state.errors.email}</p>}
            </div>

            <div>
                <label htmlFor="password">password</label>
                <input 
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={64}
                    aria-invalid={!!state.errors?.password}
                    aria-describedby={state.errors?.password ? 'password-error' : undefined}
                />
                {state.errors?.password && <p id="password-error">{state.errors.password}</p>}
            </div>

            {state.message && <p aria-live="polite">{state.message}</p>}
            <button type="submit" disabled={pending}>
                {pending ? 'Submitting...' : 'Sign Up'}
            </button>
        </form>
    )
}
