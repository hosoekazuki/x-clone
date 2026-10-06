import './globals.css';

export default function RootLayout( {
  children,
}: {
  children: React.ReactNode;
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