import { notFound } from "next/navigation";
import Link from "next/link";
import { microcmsClient } from "@/lib/microcms";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";
import PostList from "@/components/PostList";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const data = await microcmsClient.getList<Category>({ endpoint: "categories", queries: { fields: "id", limit: 100 } });
    return data.contents.map((c) => ({ id: c.id }));
  } catch {
    return [];
  }
}

async function getCategory(id: string) {
  try {
    const cat = await microcmsClient.getListDetail<Category>({ endpoint: "categories", contentId: id });
    return cat;
  } catch {
    return null;
  }
}

async function getPostsByCategory(id: string) {
  try {
    const data = await microcmsClient.getList<Post>({
      endpoint: "blogs",
      queries: { filters: `category[equals]${id}`, limit: 100 },
    });
    return data.contents;
  } catch {
    return [] as Post[];
  }
}

export default async function CategoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) return notFound();
  const posts = await getPostsByCategory(id);
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold main-text-color">Category: {category.name}</h1>
        <Link href="/categories" className="text-sm text-zinc-600 hover:underline">← カテゴリ一覧へ</Link>
      </div>
      <PostList posts={posts} />
    </main>
  );
}
