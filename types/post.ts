export type Post = {
  id: string;
  title: string;
  body?: string;
  content?: string; // fallback: microCMSで本文フィールドIDがcontentの場合
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  revisedAt?: string;
} & { [key: string]: unknown };
