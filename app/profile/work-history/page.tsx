export const revalidate = 60;

export default function WorkHistoryPage() {
  const items = [
    { period: "2023 - 現在", role: "Senior Software Engineer", org: "Example Inc.", details: ["フロントエンド基盤整備", "Next.js/TypeScript移行", "パフォーマンス最適化"] },
    { period: "2020 - 2023", role: "Software Engineer", org: "Startup Co.", details: ["新規SaaS立ち上げ", "CI/CD整備", "モバイル対応"] },
  ];
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Work History<br /><span className="text-sm">職務経歴</span></h1>
      <ol className="space-y-4">
        {items.map((w, i) => (
          <li key={i} className="rounded border p-4 bg-white dark:bg-zinc-900">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-semibold">{w.role} @ {w.org}</h2>
              <span className="text-sm text-zinc-500">{w.period}</span>
            </div>
            <ul className="mt-2 list-disc pl-5 text-zinc-700 dark:text-zinc-300">
              {w.details.map((d, j) => <li key={j}>{d}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  );
}
