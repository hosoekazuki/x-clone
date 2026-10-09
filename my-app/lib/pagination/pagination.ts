const MAX_INT = 2147483647; // 2^31 - 1

// URLのクエリパラメータからカーソルを解析する関数
export function parseCursor(value: string | string[] | undefined): number | undefined {
  if(typeof value !== 'string') return undefined;
  const n = Number(value);
  if(!Number.isInteger(n) || n <= 0 || n > MAX_INT) return undefined;
  return n;
}