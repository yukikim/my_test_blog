import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border bg-white dark:bg-zinc-900 p-4 shadow-sm hover:shadow-md transition-shadow">
      {post.eyecatch?.url && (
        <div className="mb-3 overflow-hidden rounded-md">
          <Image
            src={post.eyecatch.url}
            alt={post.title}
            width={post.eyecatch.width || 1200}
            height={post.eyecatch.height || 630}
            className="h-auto w-full object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold leading-tight mb-2">
        <Link href={`/blogs/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <div className="text-sm text-zinc-500">
        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
      </div>
    </article>
  );
}
