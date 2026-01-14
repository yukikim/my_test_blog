import { microcmsClient } from "@/lib/microcms";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN as string;
const READ_API_KEY = process.env.MICROCMS_API_KEY as string;
const WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY || "";
const COMMENTS_ENDPOINT = "comments"; // microCMS側で作成しておく

export type StoredComment = {
  id: string;
  postId: string;
  name?: string;
  email?: string;
  message: string;
  deleteToken?: string;
  createdAt?: string;
};

export async function listComments(postId: string): Promise<StoredComment[]> {
  try {
    const data = await microcmsClient.getList<StoredComment>({
      endpoint: COMMENTS_ENDPOINT,
      queries: {
        filters: `postId[equals]${postId}`,
        fields: "id,postId,name,message,createdAt",
        orders: "-createdAt",
        limit: 100,
      },
    });
    return data.contents;
  } catch {
    return [];
  }
}

export async function getCommentDetail(id: string): Promise<StoredComment | null> {
  try {
    const res = await fetch(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${COMMENTS_ENDPOINT}/${id}`, {
      headers: {
        "X-MICROCMS-API-KEY": READ_API_KEY,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as StoredComment;
  } catch {
    return null;
  }
}

export async function createComment(input: { postId: string; name?: string; email?: string; message: string; }): Promise<{ id: string; deleteToken: string; }>
{
  if (!WRITE_API_KEY) {
    throw new Error("Missing MICROCMS_WRITE_API_KEY (Write API Key) for creating comments");
  }
  const deleteToken = crypto.randomUUID();
  const body = JSON.stringify({ ...input, deleteToken });
  const res = await fetch(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${COMMENTS_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-MICROCMS-API-KEY": WRITE_API_KEY,
    },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create comment: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { id: string };
  return { id: data.id, deleteToken };
}

export async function deleteComment(id: string): Promise<void> {
  if (!WRITE_API_KEY) {
    throw new Error("Missing MICROCMS_WRITE_API_KEY (Write API Key) for deleting comments");
  }
  const res = await fetch(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${COMMENTS_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: {
      "X-MICROCMS-API-KEY": WRITE_API_KEY,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete comment: ${res.status} ${text}`);
  }
}
