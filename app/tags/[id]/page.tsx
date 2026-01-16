import { notFound } from "next/navigation";
import Link from "next/link";
import { microcmsClient } from "@/lib/microcms";
import type { Tag } from "@/types/tag";
import type { Post } from "@/types/post";
import PostList from "@/components/PostList";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const data = await microcmsClient.getList<Tag>({
      endpoint: "tags",
      queries: { fields: "id", limit: 100 },
    });
    return data.contents.map((t) => ({ id: t.id }));
  } catch {
    return [];
  }
}

async function getTag(id: string) {
  try {
    const tag = await microcmsClient.getListDetail<Tag>({
      endpoint: "tags",
      contentId: id,
    });
    return tag;
  } catch {
    return null;
  }
}

async function getPostsByTag(id: string) {
  try {
    const data = await microcmsClient.getList<Post>({
      endpoint: "blogs",
      queries: { filters: `tag[contains]${id}`, limit: 100 },
    });
    return data.contents;
  } catch {
    return [] as Post[];
  }
}

export default async function TagDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tag = await getTag(id);
  if (!tag) return notFound();

  const posts = await getPostsByTag(id);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tag: {tag.tag}</h1>
        <Link href="/tags" className="text-sm text-zinc-600 hover:underline">
          ← タグ一覧へ
        </Link>
      </div>
      <PostList posts={posts} />
    </main>
  );
}
