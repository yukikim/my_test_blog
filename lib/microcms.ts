import { createClient } from "microcms-js-sdk";
import { z } from "zod";

const envSchema = z.object({
  MICROCMS_SERVICE_DOMAIN: z.string().min(1),
  MICROCMS_API_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse({
  MICROCMS_SERVICE_DOMAIN: process.env.MICROCMS_SERVICE_DOMAIN,
  MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
});

if (!parsed.success) {
  const issues = parsed.error.flatten().fieldErrors;
  throw new Error(
    `Missing microCMS environment variables: ${JSON.stringify(issues)}`
  );
}

export const microcmsClient = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: process.env.MICROCMS_API_KEY as string,
});

export type MicroCMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};
