import type { Post } from "@/types/post";
import PostCard from "@/components/PostCard";

type PostCardVariant = "grid" | "full";

export default function PostList({
   posts,
   variant = "grid",
   }: {
     posts: Post[];
     variant?: PostCardVariant;
     }) {
  if (!posts?.length) {
    return (
      <p className="text-zinc-500">まだ記事がありません。microCMSで記事を作成してください。</p>
    );
  }
  return (
    <div className="lg:flex gap-1 flex-wrap">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} variant={variant} />)
      )}
    </div>
  );
}
