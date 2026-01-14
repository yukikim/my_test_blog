import { microcmsClient } from "@/lib/microcms";
import type { Post } from "@/types/post";
import PostList from "@/components/PostList";
import CategoryList from "@/components/CategoryList";

export const revalidate = 60; // ISR: 60秒ごとに再生成

async function getPosts() {
  try {
    const data = await microcmsClient.getList<Post>({ endpoint: "blogs" });
    return data.contents;
  } catch {
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">忘却の記録 | The Archive of Oblivion<br /><span className="text-sm">ポンコツウエットウエアの備忘録</span></h1>
      <PostList posts={posts} />
      <div className="mt-10">
        <CategoryList />
      </div>
    </main>
  );
}
