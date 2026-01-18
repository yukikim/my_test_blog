import SkillMap from "@/components/SkillMap";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {

  return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="flex">
          <h1 className="mb-6 text-3xl font-bold">
            Profile
            <span className="text-sm ml-4">プロフィール</span>
          </h1>
          <Link
            href="/profile/work-history"
            className="bg-blue-500 hover:bg-blue-700 text-white text4xl font-bold py-auto px-4 rounded h-8 inline-flex items-center"
            aria-label="Work History"
          >
            Work History
          </Link>
        </div>
        <section className="space-y-8">
          <div className="relative h-56 w-full overflow-hidden rounded-lg bg-zinc-100 sm:h-64">
            <Image
              src="/images/my_personal_image.jpg"
              alt="profile image"
              fill
              sizes="(max-width: 640px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
          <article className="prose max-w-none text-zinc-800">
            <p>私はこれまで、デザインからウェブ開発、システム構築まで幅広く経験を積んできました。</p>
            <p>DTP業務を通じてビジュアルデザイン、illustrator、photoshop使用経験やWebサイト制作、WordPress構築、Webアプリケーション、API開発やLINEアプリ制作に携わり、<br/>
              サーバー設定からアプリ設計・実装まで一貫して担当した経験を通して、<br/>
              Linux、PHP、Javascript、Node、ReactやTypescriptなどの知識、Webデザイン、バックエンドおよびフロントエンドの理解を有しています。<br/>
              フロントエンド開発とWebデザインを得意としています。<br/>
              要件定義、外部設計等の上流工程よりもメンバーとして実装作業を好みます。</p>
            <p>コンピューターはデザイン事務所での経験とDTP業務で使用していた経験からメインマシンはMacです。</p>
          </article>
          <div className="grid gap-4 lg:grid-cols-[2fr,3fr]">
            <div className="rounded border p-4 bg-white">
              <h2 className="mb-2 font-semibold">基本情報</h2>
              <ul className="space-y-1 text-sm text-zinc-600">
                <li>氏名: 木村孝幸(Takayuki Kimura)</li>
                <li>拠点: 東京都荒川区</li>
                <li>メール: tki6ra@icloud.com</li>
              </ul>
            </div>
            <div className="flex">
            <Link
                href="/profile/work-history"
                className="bg-blue-500 hover:bg-blue-700 text-white text4xl font-bold py-auto px-4 rounded h-8 inline-flex items-center"
                aria-label="Work History"
            >
              Work History
            </Link>
            </div>

            <div>
              <SkillMap title="Skills"/>
            </div>
          </div>
        </section>
      </main>
  );
}
