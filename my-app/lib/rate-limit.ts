import 'server-only';

// シンプルな固定ウィンドウ方式のレート制限。
// 「キーごとに、windowMs の間に max 回まで」を許可する。
//
// 注意: カウンターはこのサーバープロセスのメモリ上に持つ。
// - サーバーを再起動するとリセットされる
// - サーバーが複数台に増えると、台ごとに別々に数えてしまう
// 本番では Redis など共有ストアに置き換える必要がある（学習用なのでメモリ実装）。

type Bucket = {
    count: number;
    resetAt: number; // このミリ秒時刻を過ぎたらカウントをリセットする
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
    allowed: boolean;
    remaining: number; // あと何回許されるか
    retryAfterSec: number; // 制限中の場合、何秒後に再試行できるか
};

export function rateLimit(
    key: string,
    max: number,
    windowMs: number,
): RateLimitResult {
    const now = Date.now();
    const bucket = buckets.get(key);

    // 初回、またはウィンドウが切れていたら作り直す
    if (!bucket || now >= bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: max - 1, retryAfterSec: 0 };
    }

    // ウィンドウ内。上限に達していたら拒否
    if (bucket.count >= max) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
        };
    }

    bucket.count += 1;
    return { allowed: true, remaining: max - bucket.count, retryAfterSec: 0 };
}

// メモリリーク防止: 期限切れのバケツをたまに掃除する
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
        if (now >= bucket.resetAt) buckets.delete(key);
    }
}, CLEANUP_INTERVAL_MS).unref();
