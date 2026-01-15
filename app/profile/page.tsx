export const revalidate = 60;

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Profile<br /><span className="text-sm">プロフィール</span></h1>
      <section className="space-y-4">
        <p className="text-zinc-700">
          ここにプロフィールの概要を記載します。自己紹介、関心領域、現在の活動など。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded border p-4 bg-white">
            <h2 className="font-semibold mb-2">基本情報</h2>
            <ul className="space-y-1 text-sm text-zinc-600">
              <li>氏名: Your Name</li>
              <li>拠点: Tokyo, JP</li>
              <li>メール: you@example.com</li>
            </ul>
          </div>
          <div className="rounded border p-4 bg-white">
            <h2 className="font-semibold mb-2">リンク</h2>
            <ul className="space-y-1 text-sm text-blue-700">
              <li><a className="hover:underline" href="#" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a className="hover:underline" href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a className="hover:underline" href="#" target="_blank" rel="noopener noreferrer">X</a></li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
