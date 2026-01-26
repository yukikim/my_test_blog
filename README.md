# 忘却の記録（Next.js + microCMS）

Next.js（App Router）と microCMS を使った個人ブログです。ISR（`revalidate = 60`）で静的生成しつつ、一定間隔で再生成します。

## 公開先

- Vercel（Hobby）
- URL: https://my-test-blog-six.vercel.app/
- Title: 忘却の記録 | The Archive of Oblivion

## 設計概要

### 技術スタックとアーキテクチャ
- フレームワーク: Next.js 16（App Router）+ React 19 + TypeScript
- ホスティング: Vercel（ISRによる再生成・`revalidate = 60`）
- CMS: microCMS（JavaScript SDK による REST API 呼び出し）
- スタイリング: Tailwind CSS
- セキュリティ: sanitize-html による HTML サニタイズ
- コメント対策（任意）: reCAPTCHA(v2)、Akismet
- レンダリング: ISR（静的生成 + 60秒ごとの再生成）

### データモデル（microCMS）
- `blogs` エンドポイント
	- 記事本体。タイトル・本文・アイキャッチ画像、カテゴリ、タグなどを保持
	- タグは `tags` エンドポイントへの**複数参照フィールド（配列）**として `tag` プロパティで取得
	- フロントエンドでは `types/post.ts` の `Post` 型で扱う
- `categories` エンドポイント
	- 記事カテゴリ。`Category` 型として扱い、一覧・詳細・記事フィルタに利用
- `tags` エンドポイント
	- 記事タグ。`Tag` 型として扱い、タグ一覧・タグ別記事一覧・記事詳細／カード上のタグ表示に利用
- `comments` エンドポイント
	- 各記事へのコメントを保存。`postId`・`name`・`email`・`message`・`deleteToken` 等を保持
	- Write API を用いてサーバー側 API 経由で作成／削除
- `career` エンドポイント
	- 職務経歴情報（期間・会社名・業種・主な業務・経験・その他）を保持し、プロフィール配下の Work History 画面で表示

### 主なページとルーティング
- `/` （ホーム）
	- 最新のブログ記事一覧をカード形式で表示
	- 記事カードには公開日・カテゴリ・タグ（複数）を表示
- `/blogs`
	- ブログ記事一覧の専用ページ
	- `?page=1&limit=9` のようにクエリでページ番号と件数を指定可能（デフォルト 9 件 / ページ）
- `/blogs/[id]`
	- 個別記事ページ
	- microCMS から対象 ID の記事を取得し、リッチテキスト本文をサニタイズして描画
	- 見出し下にカテゴリとタグ（複数）を表示
	- 記事下部にコメント一覧（`CommentsList`）とコメント投稿フォーム（`CommentForm`）を表示
- `/blogs/[id]`
	- draftKey 付きでアクセスした場合は microCMS の下書きプレビューにも対応
- `/categories`
	- カテゴリ一覧ページ。`categories` エンドポイントから取得したカテゴリを表示
- `/categories/[id]`
	- 指定カテゴリに紐づく記事一覧を表示
- `/tags`
	- タグ一覧ページ。`tags` エンドポイントから取得したタグと、タグごとの記事数を表示
- `/tags/[id]`
	- 指定タグに紐づく記事一覧を表示
- `/profile`
	- プロフィール本文・基本情報（氏名・拠点・メール）・Skills（`SkillMap` コンポーネント）を表示
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
	- `POST` で reCAPTCHA v2（`RECAPTCHA_SECRET_KEY` がある場合のみ）を検証し、スパム判定（URL簡易ブロック + Akismet設定時）後に microCMS の `comments` に書き込み
	- `POST` の成功レスポンスで `deleteToken` を返し、クライアント側で保持
	- `DELETE` で `id` と `deleteToken` を照合して削除（コメント詳細を取得して照合）
- フロントエンド:
	- `CommentsList` がコメント一覧と削除操作を担当
	- `CommentForm` が投稿フォームと reCAPTCHA トークン送信を担当

### プレビューと運用
- ドラフトプレビュー: microCMS の `draftKey` と Next.js の Draft Mode を組み合わせて下書き確認を実現
	- `/api/preview?secret=PREVIEW_SECRET&redirect=/blogs/{id}?draftKey=...` 形式でプレビューを開始
	- `redirect` に `draftKey=` を含む場合は Draft Mode を有効化せずにリダイレクト（draftKey だけで下書き取得できるため）
	- 簡易確認: `/blogs/{id}?draftKey=...` に直接アクセス

このセクションは、実装済みコードの構造を俯瞰するための高レベルな設計メモです。詳細な変更履歴や補足は [docs/project-summary.md](docs/project-summary.md) を参照してください。

### フィード/サイトマップ
- RSS: `/rss.xml`（最新50件、本文はサニタイズしてCDATAで出力）
- Atom: `/atom.xml`（最新50件、本文はサニタイズしてCDATAで出力）
- Sitemap: `/sitemap.xml`（`app/sitemap.ts`）
- 絶対URL生成: `lib/site.ts` の `getSiteUrl()`（`NEXT_PUBLIC_SITE_URL` → `SITE_URL` → `VERCEL_URL` → localhost）

### セキュリティ方針
- microCMS本文HTMLは `lib/sanitize.ts` の `sanitizeHTML()` を通してから描画・配信
- コメント投稿は reCAPTCHA/Akismet を「設定されている場合のみ」有効化（未設定時は開発向けにスキップ）
- コメント削除は `deleteToken` による簡易認可

## 環境変数（一覧）

必須（microCMS 読み取り）

- `MICROCMS_SERVICE_DOMAIN`
- `MICROCMS_API_KEY`

コメント（作成/削除を使う場合）

- `MICROCMS_WRITE_API_KEY`

プレビュー

- `PREVIEW_SECRET`

reCAPTCHA（任意）

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `RECAPTCHA_DEBUG`（`true` で検証ログ出力）

Akismet（任意）

- `AKISMET_KEY`
- `AKISMET_BLOG`

フィード/サイトマップのサイトURL（本番推奨）

- `NEXT_PUBLIC_SITE_URL`（または `SITE_URL`）

メール通知（現状はユーティリティのみ、任意）

- `RESEND_API_KEY`
- `COMMENTS_TO_EMAIL`
- `COMMENTS_FROM_EMAIL`

## 開発コマンド

```bash
npm install
npm run dev
```

```bash
npm run build
npm run start
```

```bash
npm run lint
```
