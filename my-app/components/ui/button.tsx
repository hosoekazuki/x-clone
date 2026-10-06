import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
    fullWidth?: boolean; // trueなら横幅いっぱいに広げる
};

// 主要な操作に使う黒いボタン
export function Button({ children, fullWidth = false, ...buttonProps }: ButtonProps){
    return (
        <button
            {...buttonProps}
            className={`rounded-full bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700 disabled:opacity-50 ${fullWidth ? 'w-full' : ''}`}
        >
            {children}
        </button>
    );
}
