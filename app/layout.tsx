import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import NavBar from "@/components/NavBar";
import Footer from "@/components/footer";
import BackgroundWrapper from "@/components/BackgroundWrapper";

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
          className="font-main"
      >
      <NavBar/>
        <BackgroundWrapper>
        {children}
        </BackgroundWrapper>
      <SpeedInsights/>
      <Footer/>
      </body>
      </html>
  );
}
