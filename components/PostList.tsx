import type { Post } from "@/types/post";
import PostCard from "@/components/PostCard";

export default function PostList({ posts }: { posts: Post[] }) {
  if (!posts?.length) {
    return (
      <p className="text-zinc-500">まだ記事がありません。microCMSで記事を作成してください。</p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
