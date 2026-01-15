# This is a Next.js + microCMS blog project.

## Deploy on Vercel

Vercel: yukikim_v's projects (Hobby)

https://my-test-blog-six.vercel.app/

Blog title: 忘却の記録 | The Archive of Oblivion

忘却の記録 ｜ ポンコツウエットウエアの備忘録

## 基本設計

### 技術スタックとアーキテクチャ
- フレームワーク: Next.js（App Router）+ React + TypeScript
- ホスティング: Vercel（ISRによる再生成・`revalidate = 60`）
- CMS: microCMS（JavaScript SDK による REST API 呼び出し）
- スタイリング: Tailwind CSS
- セキュリティ: sanitize-html による HTML サニタイズ、reCAPTCHA(v2)、Akismet によるコメントスパム対策
- メール送信: Resend を利用したコメント通知
- レンダリング: ISR（静的生成 + 60秒ごとの再生成）

### データモデル（microCMS）
- `blogs` エンドポイント
	- 記事本体。タイトル・本文・アイキャッチ画像などを保持
	- フロントエンドでは `types/post.ts` の `Post` 型で扱う
- `categories` エンドポイント
	- 記事カテゴリ。`Category` 型として扱い、一覧・詳細・記事フィルタに利用
- `comments` エンドポイント
	- 各記事へのコメントを保存。`postId`・`name`・`email`・`message`・`deleteToken` 等を保持
	- Write API を用いてサーバー側 API 経由で作成／削除
- `career` エンドポイント
	- 職務経歴情報（期間・会社名・業種・主な業務・経験・その他）を保持し、プロフィール配下の Work History 画面で表示

### 主なページとルーティング
- `/` （ホーム）
	- 最新のブログ記事一覧をカード形式で表示
- `/blogs/[id]`
	- 個別記事ページ
	- microCMS から対象 ID の記事を取得し、リッチテキスト本文をサニタイズして描画
	- 記事下部にコメント一覧（`CommentsList`）とコメント投稿フォーム（`CommentForm`）を表示
- `/categories`
	- カテゴリ一覧ページ。`categories` エンドポイントから取得したカテゴリを表示
- `/categories/[id]`
	- 指定カテゴリに紐づく記事一覧を表示
- `/profile/work-history`
	- `career` エンドポイントから職務経歴を取得し、期間・会社名・業種・主な業務・経験・その他をセクションごとに表示
- `/rss.xml`・`/atom.xml`・`/sitemap.xml`
	- ブログ記事やカテゴリ、トップページを対象とした RSS/Atom フィードとサイトマップを提供

### データ取得と共通ユーティリティ
- `lib/microcms.ts`
	- 環境変数（`MICROCMS_SERVICE_DOMAIN`・`MICROCMS_API_KEY`）を zod で検証し、microCMS クライアントを生成
	- `getList` / `getListDetail` を通じて各エンドポイントからデータ取得
- `lib/sanitize.ts`
	- `sanitize-html` を使い、許可されたタグ・属性のみを残して本文 HTML をサニタイズ
- `lib/site.ts`
	- `NEXT_PUBLIC_SITE_URL` などからサイトのベース URL を決定し、フィードやサイトマップ内の絶対 URL を生成

### コメント機能の設計
- API ルート: `/api/comments`
	- `GET ?postId=...` で対象記事のコメント一覧を取得
	- `POST` で reCAPTCHA v2 及びAkismet 検証後、microCMS の `comments` に書き込み
	- `DELETE` で `id` と `deleteToken` を検証して削除
- フロントエンド:
	- `CommentsList` がコメント一覧と削除操作を担当
	- `CommentForm` が投稿フォームと reCAPTCHA トークン送信を担当

### プレビューと運用
- ドラフトプレビュー: microCMS の `draftKey` と Next.js の Draft Mode を組み合わせて下書き確認を実現
	- `/api/preview?secret=PREVIEW_SECRET&redirect=/blogs/{id}?draftKey=...` 形式でプレビューを開始
- 環境変数
	- `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` / `MICROCMS_WRITE_API_KEY`
	- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` / `RESEND_API_KEY` などを Vercel 環境変数にも設定

このセクションは、実装済みコードの構造を俯瞰するための高レベルな設計メモです。詳細な変更履歴や補足は `docs/project-summary.md` を参照してください。
