import Link from "next/link";
import { microcmsClient } from "@/lib/microcms";
import type { Category } from "@/types/category";

export const revalidate = 60;

async function getCategories() {
  try {
    const data = await microcmsClient.getList<Category>({ endpoint: "categories", queries: { limit: 100, fields: "id,name" } });
    return data.contents;
  } catch {
    return [] as Category[];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-zinc-500">カテゴリがありません。microCMSで作成してください。</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id} className="rounded border p-4 bg-white dark:bg-zinc-900">
              <Link href={`/categories/${c.id}`} className="hover:underline font-medium">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
