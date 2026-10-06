import type { ComponentProps } from 'react';

type TextFieldProps = ComponentProps<'input'> & {
    id: string;
    label: string;
    error?: string;
};

// ラベル・入力欄・エラー文をまとめた入力フィールド
export function TextField({ id, label, error, ...inputProps }: TextFieldProps){
    const errorId = `${id}-error`;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold">{label}</label>
            <input
                {...inputProps}
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-gray-400 focus:outline-none"
            />
            {error && <p id={errorId} className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
