import Link from "next/link";
import { microcmsClient } from "@/lib/microcms";
import type { Category } from "@/types/category";

async function getCategories() {
  try {
    const data = await microcmsClient.getList<Category>({
      endpoint: "categories",
      queries: { limit: 100, fields: "id,name" },
    });
    return data.contents;
  } catch {
    return [] as Category[];
  }
}

export default async function CategoryList() {
  const categories = await getCategories();
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Categories</h2>
      {categories.length === 0 ? (
        <p className="text-zinc-500">カテゴリがありません。microCMSで作成してください。</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id} className="rounded border p-4 bg-white">
              <Link href={`/categories/${c.id}`} className="hover:underline font-medium">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
