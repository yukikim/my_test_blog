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
            <div className="text-center">
                <h1 className="text-5xl font-tokumin tracking-tight text-balance text-white sm:text-7xl">
                    忘却の記録<br /><span className="text-2xl tracking-normal">The Archive of Oblivion</span>
                </h1>
                <p className="mt-8 text-lg font-tokumin text-gray-400 sm:text-xl/8 mb-4">
                    ポンコツウエットウエアの備忘録としてのブログです。
                </p>
                {/* コンテンツ */}
                <div className="text-left bg-gray-700 p-6 text-gray-300 lg:mt-20 rounded-lg">
                    <PostList posts={posts} />
                </div>
                {/* {children} */}
                {/* コンテンツここまで */}
            </div>
        </main>

    );
}
