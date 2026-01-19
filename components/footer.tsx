export default function Footer() {
  return (
    <footer className="bg-gray-500 px-4 py-8 text-center text-sm text-gray-200">
      <p>Next.js + microCMS + Vercel + Tailwind CSS</p>
      <p>© {new Date().getFullYear()} 忘却の記録. All rights reserved.</p>
    </footer>
  );
}