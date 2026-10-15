import 'server-only';
import { headers } from 'next/headers';

// クライアントの識別子（IP）を取り出す。
//
// X-Forwarded-For はクライアントが自由に偽装できるヘッダーなので、
// 「信頼できるプロキシ（ロードバランサ）を自分で前段に置いている」場合にだけ使う。
// TRUST_PROXY=true のときだけ XFF を読む、という方針にして、
// 偽装されたヘッダーを無条件に信用しないようにする。
//
// XFF は "client, proxy1, proxy2" の形式。信頼できる前段プロキシが
// 付けるのは末尾側なので、素朴に先頭を取ると偽装値をつかまされる。
// ここでは学習用に「末尾（最も自分に近い=信頼できる）」を採用する。
export async function getClientIp(): Promise<string> {
    const h = await headers();
    const trustProxy = process.env.TRUST_PROXY === 'true';

    if (trustProxy) {
        const xff = h.get('x-forwarded-for');
        if (xff) {
            const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
            const last = parts.at(-1);
            if (last) return last;
        }
    }

    // プロキシを信頼しない場合のフォールバック。
    // 開発環境では識別子が取れないことがあるので、固定値で1グループ扱いにする。
    return 'unknown';
}
