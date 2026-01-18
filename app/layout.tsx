import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin', 'japanese'],
  weight: ['400', '700'],
  variable: '--font-noto',
  fallback: [
    'Hiragino Sans',
    'Hiragino Kaku Gothic ProN',
    'Meiryo',
    'sans-serif'
  ]
})


export const metadata: Metadata = {
  title: "忘却の記録",
  description: "The Archive of Oblivion | ポンコツウエットウエアの備忘録",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased`}
      >
        <header className="border-b bg-teal-50 text-teal-900">
          <nav className="mx-auto max-w-5xl p-4 flex gap-4">
            <a href="/" className="font-semibold hover:underline">忘却の記録 | The Archive of Oblivion</a>
            <a href="/blogs" className="hover:underline">Post list</a>
            <a href="/categories" className="hover:underline">Categories</a>
            <a href="/tags" className="hover:underline">Tags</a>
            <a href="/profile" className="hover:underline">Profile</a>
            <a href="/profile/work-history" className="hover:underline">Work History</a>
          </nav>
        </header>
        {children}
        <SpeedInsights/>
      </body>
    </html>
  );
}
