import Link from "next/link";
import { microcmsClient } from "@/lib/microcms";
import type { Tag } from "@/types/tag";
import type { Post } from "@/types/post";

type TagWithCount = Tag & { count: number };

async function getTags(): Promise<TagWithCount[]> {
  try {
    const tagsData = await microcmsClient.getList<Tag>({
      endpoint: "tags",
      queries: { limit: 100, fields: "id,tag" },
    });

    const countMap = new Map<string, number>();

    try {
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const postsData = await microcmsClient.getList<Post>({
          endpoint: "blogs",
          queries: { limit, offset, fields: "id,tag" },
        });

        postsData.contents.forEach((post) => {
          (post.tag ?? []).forEach((t) => {
            const tagId = t.id;
            if (tagId) {
              countMap.set(tagId, (countMap.get(tagId) || 0) + 1);
            }
          });
        });

        offset += limit;
        hasMore = postsData.contents.length === limit;
      }
    } catch (error) {
      console.error("Failed to fetch posts for tag counting:", error);
    }

    return tagsData.contents.map((tag) => ({
      ...tag,
      count: countMap.get(tag.id) || 0,
    }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [] as TagWithCount[];
  }
}

export default async function TagList() {
  const tags = await getTags();

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Tags</h2>
      {tags.length === 0 ? (
        <p className="text-zinc-500">タグがありません。microCMSで作成してください。</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tags/${t.id}`}
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs content-frame-in text-gray-300 hover:bg-zinc-500"
              >
                <span className="mr-1">#{t.tag ?? "tag"}</span>
                <span className="text-zinc-200">({t.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
