import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border border-gray-500 p-4 shadow-sm hover:shadow-md transition-shadow">
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
      <h3 className="text-lg font-semibold leading-tight mb-2 text-gray-200">
        <Link href={`/blogs/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <div className="text-sm text-zinc-500">
        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
      </div>
      {post.tag && post.tag.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1 text-xs">
          {post.tag.map((t) => (
            <Link
              key={t.id}
              href={`/tags/${t.id}`}
              className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 hover:bg-emerald-100"
            >
              #{t.tag ?? "tag"}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
