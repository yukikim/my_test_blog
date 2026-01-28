import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/post";

type PostCardVariant = "grid" | "full";

function formatDateYYYYMMDDSLash(iso: string) {
  // Hydration mismatch対策: SSR/CSRで同一結果になるようロケールとタイムゾーンを固定
  return new Date(iso).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

export default function PostCard({
  post,
  variant = "grid",
}: {
  post: Post;
  variant?: PostCardVariant;
}) {
  const widthClass =
    variant === "full" ? "w-full" : "lg:w-[calc(26.3%-1rem)]";
  const articleClassName = [
    widthClass,
    "rounded-lg p-2 mb-2 lg:mb-0 content-frame-in",
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
          {post.publishedAt && formatDateYYYYMMDDSLash(post.publishedAt)}
        </div>
        {post.tag && post.tag.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 text-xs">
            {post.tag.map((t) => (
              <Link
                key={t.id}
                href={`/tags/${t.id}`}
                className="rounded-full bg-theme-secondary px-2 py-0.5 text-zinc-100 hover:bg-theme-dark"
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
