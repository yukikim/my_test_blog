import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import NavBar from "@/components/NavBar";

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

// <meta name="viewport" content="width=device-width, initial-scale=1.0">


export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1.0",
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
      <NavBar/>
      {children}
      <SpeedInsights/>
      </body>
      </html>
  );
}
