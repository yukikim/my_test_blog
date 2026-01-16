import Image from "next/image";
import { microcmsClient } from "@/lib/microcms";
import { sanitizeHTML } from "@/lib/sanitize";
import SkillMap from "@/components/SkillMap";
import type { Profile } from "@/types/profile";

export const revalidate = 60;

async function getProfile(): Promise<Profile | null> {
  try {
    const data = await microcmsClient.getObject<Profile>({
      endpoint: "profile",
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Profile
        <br />
        <span className="text-sm">プロフィール</span>
      </h1>

      {!profile ? (
        <p className="text-zinc-500">
          プロフィール情報を取得できませんでした。microCMS で profile コンテンツを確認してください。
        </p>
      ) : (
        <section className="space-y-8">
          {profile.eyecatch?.url && (
            <div className="relative h-56 w-full overflow-hidden rounded-lg bg-zinc-100 sm:h-64">
              <Image
                src={profile.eyecatch.url}
                alt={profile.name ?? "Profile image"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 768px, 100vw"
              />
            </div>
          )}
          {profile.content ? (
            <article
              className="prose max-w-none text-zinc-800"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(profile.content) }}
            />
          ) : (
            <p className="text-zinc-500">
              プロフィールの概要を microCMS の profile コンテンツから設定してください。
            </p>
          )}

          <div className="grid gap-4 lg:grid-cols-[2fr,3fr]">
            <div className="rounded border p-4 bg-white">
              <h2 className="mb-2 font-semibold">基本情報</h2>
              <ul className="space-y-1 text-sm text-zinc-600">
                <li>氏名: {profile.name}</li>
                {profile.address && <li>拠点: {profile.address}</li>}
                {profile.mail && <li>メール: {profile.mail}</li>}
              </ul>
            </div>
            <div>
              <SkillMap title="Skills" />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
