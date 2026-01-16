export type Profile = {
  name: string;
  address?: string;
  mail?: string;
  content?: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  } | null;
};
