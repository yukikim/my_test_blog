import Link from "next/link";
import { microcmsClient } from "@/lib/microcms";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";

type CategoryWithCount = Category & { count: number };

async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    // カテゴリを取得
    const categoriesData = await microcmsClient.getList<Category>({
      endpoint: "categories",
      queries: { limit: 100, fields: "id,name" },
    });

    // カテゴリごとの記事数をカウント
    const countMap = new Map<string, number>();
    
    try {
      // 全記事を取得（ページネーション対応）
      let offset = 0;
      const limit = 100; // microCMSの上限
      let hasMore = true;

      while (hasMore) {
        const postsData = await microcmsClient.getList<Post>({
          endpoint: "blogs",
          queries: { limit, offset, fields: "id,category" },
        });

        postsData.contents.forEach((post) => {
          const categoryId = post.category?.id;
          if (categoryId) {
            countMap.set(categoryId, (countMap.get(categoryId) || 0) + 1);
          }
        });

        offset += limit;
        hasMore = postsData.contents.length === limit;
      }
    } catch (error) {
      console.error("Failed to fetch posts for counting:", error);
    }

    // カテゴリに記事数を追加
    return categoriesData.contents.map((category) => ({
      ...category,
      count: countMap.get(category.id) || 0,
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [] as CategoryWithCount[];
  }
}

export default async function CategoryList() {
  const categories = await getCategories();
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Categories</h2>
      {categories.length === 0 ? (
        <p className="">カテゴリがありません。microCMSで作成してください。</p>
      ) : (
        <ul className="">
          {categories.map((c) => (
            <li key={c.id} className="rounded border p-4 content-frame-in text-gray-400 mb-1">
              <Link href={`/categories/${c.id}`} className="hover:underline font-medium">
                {c.name}
                <span className="ml-2 text-sm">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
