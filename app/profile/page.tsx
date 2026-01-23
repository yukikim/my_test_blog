import SkillMap from "@/components/SkillMap";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="lg:flex justify-between gap-1 mb-4">
        <h1 className="mb-6 text-3xl font-bold text-gray-400">
          Profile
          <span className="text-sm ml-4 text-gray-300">プロフィール</span>
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
        <div className="relative h-56 lg:h-160 w-full overflow-hidden rounded-lg bg-zinc-100 sm:h-64 lg:mb-20">
          <Image
            src="/images/my_personal_image4.jpg"
            alt="profile image"
            fill
            sizes="(max-width: 640px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>

        <div className="lg:flex gap-4">

          <div className="lg:w-2/3">
            <article className="prose max-w-none text-gray-200 mb-6">
              <p>私はこれまで、デザインからウェブ開発、システム構築まで幅広く経験を積んできました。</p>
              <p>DTP業務を通じてビジュアルデザイン、illustrator、photoshop使用経験やWebサイト制作、WordPress構築、Webアプリケーション、API開発やLINEアプリ制作に携わり、<br />
                サーバー設定からアプリ設計・実装まで一貫して担当した経験を通して、<br />
                Linux、PHP、Javascript、Node、ReactやTypescriptなどの知識、Webデザイン、バックエンドおよびフロントエンドの理解を有しています。<br />
                フロントエンド開発とWebデザインを得意としています。<br />
                要件定義、外部設計等の上流工程よりもメンバーとして実装作業を好みます。</p>
              <p>コンピューターはデザイン事務所での経験とDTP業務で使用していた経験からメインマシンはMacです。</p>
            </article>
            <div className="rounded border border-gray-500 p-4 bg-gray-800 text-gray-100">
              <h2 className="mb-2 font-semibold">基本情報</h2>
              <ul className="space-y-1 text-sm text-zinc-100">
                <li>氏名: 木村孝幸(Takayuki Kimura)</li>
                <li>拠点: 東京都荒川区</li>
                <li>メール: tki6ra@icloud.com</li>
              </ul>
            </div>
          </div>

          <div className="lg:w-1/3">
            <SkillMap title="Skills" />
          </div>

        </div>

      </section>
    </main>
  );
}
