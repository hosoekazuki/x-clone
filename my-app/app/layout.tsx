// すべてのページに共通するレイアウトを定義したファイル
// 子要素をchildrenとして受け取り、HTMLの構造を定義している。

import './globals.css';

export default function RootLayout( {
  children,
}: {
  children: React.ReactNode; // ReactNode型のchildrenを受け取っている。描画可能なすべての型
}) {
  return (
    <html lang="ja">
      <body>
        <div className="mx-auto min-h-screen max-w-xl border-x border-gray-200">
          {children}
        </div>
      </body>
    </html>
  )
}