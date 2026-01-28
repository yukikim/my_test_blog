import SkillMap from "@/components/SkillMap";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="lg:flex justify-between gap-1 mb-4">
        <h1 className="mb-4 text-3xl font-bold text-gray-400">
          Profile
          <span className="text-sm ml-4 text-gray-300">プロフィール</span>
        </h1>
        {/* <Link
          href="/profile/work-history"
          className="bg-blue-500 hover:bg-blue-700 text-white text4xl font-bold py-auto px-4 rounded h-8 inline-flex items-center"
          aria-label="Work History"
        >
          Work History
        </Link> */}
      </div>
      <section className="space-y-8">
        <div className="relative h-56 lg:h-160 w-full overflow-hidden rounded-lg bg-zinc-100 sm:h-64 lg:mb-10">
          <Image
            src="/images/my_personal_image5.jpg"
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

              <div className="content-in-back p-4 text-gray-800 rounded-2xl mb-4">
                <h2 className="text-sm lg:text-xl font-semibold mb-2">デザインから開発まで、ものづくりをトータルに楽しむ</h2>
                <p className="mb-4 text-sm">
                  私はこれまで、DTPデザインからWeb制作、そしてシステム構築まで、デジタルの領域を幅広く歩んできました。<br />
                  IllustratorやPhotoshopを手にデザインに没頭した日々から始まり、現在はReactやTypeScript、Node.jsなどを用いたモダンなWeb開発をメインに活動しています。<br />
                  サーバー設定からアプリの実装まで一貫して携わってきた経験があるため、<br />
                  <strong>「デザインの意図を汲み取ったスムーズな実装」</strong>には特に自信があります。<br />
                  なかでも、ユーザーが直接触れる「フロントエンド開発」と「Webデザイン」が大好きです。<br />
                  設計図を描くよりも、実際に手を動かして形にしていく「実装作業」にやりがいを感じます。<br />
                  ちなみに、デザイン事務所時代からの相棒であるMacが私のメインマシンです。<br />
                  クリエイティブな視点とエンジニアの視点、その両方を大切にしながら、使い心地の良いものをお届けしたいと思っています。
                </p>
              </div>

              <div className="rounded-xl border border-gray-600 p-4 bg-gray-700 text-gray-300">
                <h2 className="mb-2 font-semibold">基本情報</h2>
                <ul className="space-y-1 text-sm text-zinc-100">
                  <li>氏名: 木村孝幸(Takayuki Kimura)</li>
                  <li>拠点: 東京都荒川区</li>
                  <li>メール: tki6ra@icloud.com</li>
                </ul>
              </div>

              <div className="my-4 p-4 bg-neutral-700 rounded-2xl text-sm">
                <p className="mb-4">
                  このサイトは、私の個人開発プロジェクトとして制作した「技術メモ兼ポートフォリオ」ブログです。<br />
                  Next.js（App Router）と microCMS を組み合わせ、運用しやすいCMSベースの更新フローと、
                  高速な表示・堅牢なセキュリティを両立することを目的に設計しました。
                </p>

                <h2 className="text-gray-100 text-xl mb-2">プロジェクトの狙い</h2>
                <ul className="mb-4 list-inside list-disc">
                  <li>記事を継続的に公開できる、編集しやすいブログ基盤を作る</li>
                  <li>静的生成と再生成（ISR）を活用して、速度と更新性を両立する</li>
                  <li>外部入力（本文HTML・コメント）を安全に扱い、実運用レベルの対策を組み込む</li>
                </ul>

                <h2 className="text-gray-100 text-xl mb-2">主な機能</h2>
                <ul className="mb-4 list-inside list-disc">
                  <li>記事一覧 / 記事詳細（カテゴリ・タグによる分類）</li>
                  <li>カテゴリ一覧・カテゴリ別記事、タグ一覧・タグ別記事</li>
                  <li>コメント投稿・削除（スパム対策／削除トークンによる簡易認可）</li>
                  <li>下書きプレビュー（draftKey + プレビュー用APIでの導線）</li>
                  <li>RSS / Atom フィード、サイトマップ生成</li>
                </ul>

                <h2 className="text-gray-100 text-xl mb-2">技術的なポイント</h2>
                <p className="mb-4">
                  レンダリングはISR（一定間隔で再生成）を採用し、コンテンツ更新とパフォーマンスのバランスを最適化しています。<br />
                  microCMSのデータは型定義（TypeScript）に寄せて扱い、環境変数はバリデーションして起動時に不備を検知できるようにしました。
                </p>
                <p className="mb-4">
                  セキュリティ面では、本文HTMLをサニタイズしてから描画・配信し、コメント投稿では
                  reCAPTCHA（設定時）とAkismet（設定時）によるスパム対策を組み込みました。<br />
                  「運用で起こり得る問題」を前提に、失敗時も落ちにくい作りを意識しています。
                </p>

                <h2 className="text-gray-100 text-xl mb-2">今後の拡張アイデア</h2>
                <ul className="mb-4 list-inside list-disc">
                  <li>検索（キーワード / カテゴリ / タグの統合UI）</li>
                  <li>関連記事表示（同カテゴリ・同タグ）</li>
                  <li>OG画像の自動生成</li>
                </ul>

                <p className="mb-4">プロジェクトは
                  <Link href="https://github.com/yukikim/my_test_blog" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</Link>
                  で公開しています。</p>

              </div>
            </article>
          </div>

          <div className="lg:w-1/3">
            <SkillMap title="Skills" />
            <div className="flex justify-end">
              <Link
                href="/profile/work-history"
                className="bg-blue-500 hover:bg-blue-700 text-white text4xl font-bold py-auto px-4 rounded h-8 inline-flex items-center"
                aria-label="Work History"
              >
                Work History
              </Link>
            </div>
          </div>

        </div>

      </section>
    </main>
  );
}
