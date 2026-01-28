import { microcmsClient } from "@/lib/microcms";
import { sanitizeHTML } from "@/lib/sanitize";
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

export default async function WorkHistoryPage() {
  const items = await getCareerItems();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-300">
        Work History
        <br />
        <span className="text-sm text-zinc-200">主な職務経歴</span>
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
              <li key={item.id} className="rounded p-4 content-back">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{item.company ?? "会社名未設定"}</h2>
                    {item.industry && (
                      <p className="text-sm text-zinc-700">{item.industry}</p>
                    )}
                  </div>
                  {item.period && (
                    <span className="text-sm text-zinc-700">{item.period}</span>
                  )}
                </div>
                <dl className="mt-3 space-y-3 text-zinc-800">
                  <div className="lg:flex gap-4">
                    <div className="lg:w-3/4 mb-4">
                      <p className="text-sm mb-2 font-semibold uppercase tracking-wide text-zinc-800">{detailRows[0].label}</p>
                      <div className="border-b pb-4 lg:border-0 text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHTML(detailRows[0].value) }}>
                      </div>
                    </div>
                    <div className="content-in-back lg:w-1/4 p-2 rounded mb-4">
                      <p className="text-sm mb-2 font-semibold uppercase tracking-wide text-zinc-800">{detailRows[1].label}</p>
                      <div className="text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHTML(detailRows[1].value) }}>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2 font-semibold uppercase tracking-wide text-zinc-800">{detailRows[2]?.label ? detailRows[2].label : ""}</p>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHTML(detailRows[2]?.value ? detailRows[2].value : "") }}>
                    </div>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
