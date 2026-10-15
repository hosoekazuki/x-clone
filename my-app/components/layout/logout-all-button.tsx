import { logoutAll } from '@/lib/auth/actions';

export function LogoutAllButton(){
    return(
        <form action={logoutAll}>
            <button
                type="submit"
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold hover:bg-gray-100"
            >
                全端末からログアウト
            </button>
        </form>
    )
}
