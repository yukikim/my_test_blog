'use client';
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/post";
import { usePathname } from 'next/navigation'
import path from "path";


export default function PostCard({ post }: { post: Post }) {
const pathname = usePathname()
console.log('PostCard pathname:', pathname)
// "/blogs/*" のみ true（"/blogs" は false）
// 例: "/blogs/123" => true, "/blogs" => false
const isBlogsWildcard = pathname.startsWith('/blogs/') && pathname.length > '/blogs/'.length;
console.log('isBlogsPath:', isBlogsWildcard);
const articleClassName = [
  "w-[calc(50%-1rem)] rounded-lg border border-gray-500 p-2 shadow-sm hover:shadow-md transition-shadow bg-[#2c374d]",
  isBlogsWildcard ? "w-full" : "lg:w-[calc(20%-1rem)] ",
]
  return (
    <article className={articleClassName.join(" ")}>
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
      <h3 className="text-sm font-semibold leading-tight mb-2">
        <Link href={`/blogs/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <div className="flex items-end flex-wrap justify-between gap-2">
      <div className="text-sm">
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

      </div>
    </article>
  );
}
