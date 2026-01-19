import type { Metadata } from "next";
// import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import NavBar from "@/components/NavBar";
import Footer from "@/components/footer";

// const notoSansJP = Noto_Sans_JP({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-noto',
//   fallback: [
//     'Hiragino Sans',
//     'Hiragino Kaku Gothic ProN',
//     'Meiryo',
//     'sans-serif'
//   ]
// })


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
          // className={`${notoSansJP.variable} antialiased`}
          className="font-main"
      >
      <NavBar/>
      <div className="min-h-[calc(100vh-140px)] bg-[url('/images/background-img001.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
        <div className="bg-gray-900 opacity-95 min-h-[calc(100vh-140px)]">

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#a22c0c] to-[#89fcb7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-36">
                        {/* コンテンツ */}
                          {children}
                        {/* コンテンツここまで */}
                    {/* <div className="text-center">
                        <h1 className="text-5xl font-tokumin tracking-tight text-balance text-white sm:text-7xl">
                            忘却の記録<br /><span className="text-2xl tracking-normal">The Archive of Oblivion</span>
                        </h1>
                        <p className="mt-8 text-lg font-tokumin text-gray-400 sm:text-xl/8">
                            ポンコツウエットウエアの備忘録としてのブログです。
                        </p>
                    </div> */}
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-23rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-50rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#a22c0c] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                    />
                </div>
            </div>
        </div>
      </div>
      <SpeedInsights/>
      <Footer/>
      </body>
      </html>
  );
}
