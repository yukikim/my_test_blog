import { microcmsClient } from "@/lib/microcms";
import type { Career } from "@/types/career";

export const revalidate = 60;

async function getCareerItems(): Promise<Career[]> {
  try {
    const data = await microcmsClient.getList<Career>({
      endpoint: "career",
      queries: { limit: 100, orders: "-publishedAt" },
    });
    return data.contents;
  } catch (error) {
    console.error("Failed to fetch career items:", error);
    return [];
  }
}

function renderMultiline(text: string) {
  return text.split(/\r?\n/).map((line, index) => (
    <span key={`${index}-${line}`} className={index > 0 ? "block" : undefined}>
      {line}
    </span>
  ));
}

export default async function WorkHistoryPage() {
  const items = await getCareerItems();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Work History
        <br />
        <span className="text-sm">主な職務経歴</span>
      </h1>
      {items.length === 0 ? (
        <p className="text-zinc-500">職務経歴が登録されていません。microCMSで追加してください。</p>
      ) : (
        <ol className="space-y-4">
          {items.map((item) => {
            const detailRows = [
              { label: "主な業務", value: item.mainWork },
              { label: "経験", value: item.experience },
              { label: "その他", value: item.others },
            ].filter((row): row is { label: string; value: string } => Boolean(row.value));

            return (
              <li key={item.id} className="rounded border p-4 bg-white">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{item.company ?? "会社名未設定"}</h2>
                    {item.industry && (
                      <p className="text-sm text-zinc-500">{item.industry}</p>
                    )}
                  </div>
                  {item.period && (
                    <span className="text-sm text-zinc-500">{item.period}</span>
                  )}
                </div>
                <dl className="mt-3 space-y-3 text-zinc-700">
                  {detailRows.map((row) => (
                    <div key={row.label}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-base">
                        {renderMultiline(row.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
