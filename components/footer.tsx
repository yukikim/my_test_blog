import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-gray-500 px-4 py-6 text-center text-sm text-gray-200">
      <p className="text-xs mb-4">
        <Link href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
        <Image src={'/images/nextjs-logotype-dark-background.png'} alt="Next.js Icon" width={80} height={80} className="inline" />
        </Link>
        &nbsp; + &nbsp;
        <Link href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
        <Image src={'/images/vercel-logotype-dark.png'} alt="Vercel Icon" width={80} height={80} className="inline" />
        </Link>
        &nbsp; + &nbsp;
        <Link href="https://microcms.io/" target="_blank" rel="noopener noreferrer">
        <Image src={'/images/microCMS_logo_white.png'} alt="microCMS Icon" width={80} height={80} className="inline" />
        </Link>
        &nbsp; + &nbsp;
        <Link href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
        <Image src={'/images/tailwindcss-logo-white.png'} alt="Tailwind CSS Icon" width={80} height={80} className="inline" />
        </Link>
        </p>
      <p>© {new Date().getFullYear()} 忘却の記録. All rights reserved.</p>

    </footer>
  );
}