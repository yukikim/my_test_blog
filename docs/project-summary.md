# プロジェクト作業概要（Next.js + microCMS + Vercel）

## 概要
- 本プロジェクトは Next.js 16（App Router）と microCMS を用いたブログサイトです。
- デプロイ対象は Vercel。ISR（60秒）で再生成されます。
- エンドポイントは `blogs` に統一し、本文が無いケースにも堅牢に対応しました。
  - `PREVIEW_SECRET=***`（ドラフトプレビュー用の任意の長い文字列）

## 技術スタック
- Next.js 16 / React 19 / TypeScript
- microCMS（JavaScript SDK）
- Tailwind CSS
- サニタイズ: sanitize-html（SSRでHTMLを安全化）

## 環境変数
---
## 下書きプレビュー（microCMSプレビュートークン対応）
ドラフトの内容をサイトで確認できるように、`draftKey` と Next.js のドラフトモードに対応しています。

### 事前準備
- `.env.local` に `PREVIEW_SECRET` を設定（本番では Vercel の Environment Variables にも設定）
- microCMS管理画面の各コンテンツ詳細で「プレビュー」を開き、`draftKey` を取得

### 確認方法（2通り）
- 直接アクセス（簡易）
  - `/blogs/{id}?draftKey={取得したプレビュートークン}`
- ドラフトモードを有効化してリダイレクト（推奨）
  - `/api/preview?secret={PREVIEW_SECRET}&redirect=/blogs/{id}?draftKey={トークン}`
  - 正常な `secret` の場合、Next.js のドラフトモードが有効化され、指定のURLへ移動します。

### 仕様メモ
- 詳細ページ: [app/blogs/[id]/page.tsx](../app/blogs/%5Bid%5D/page.tsx)
  - `searchParams.draftKey` を検出して `microcmsClient.getListDetail()` に `queries: { draftKey }` を渡します。
  - 本文はサニタイズ後に描画します（XSS対策）。
- プレビューAPI: [app/api/preview/route.ts](../app/api/preview/route.ts)
  - `?secret=...` を検証し、`draftMode().enable()` を実行してから `redirect` へ遷移します。
- 解除方法
  - （簡易）ブラウザのCookieをクリア、またはシークレットウィンドウを閉じる
  - （必要なら）`disable` の専用ルートを追加可能です。希望があれば実装します。

  ---
  ## 更新履歴（2026-01-13）
  - **エンドポイント統一:** `posts` → `blogs` に切替え。既存コードとREADMEを更新。
  - **本文検出の強化:** `content → body → text → description → richtext → html` の順で自動検出。
  - **HTMLサニタイズ導入:** `sanitize-html` を追加し [lib/sanitize.ts](../lib/sanitize.ts) を新規作成。詳細ページでサニタイズ後に描画。
  - **カテゴリ対応:** [types/category.ts](../types/category.ts) 追加、[app/categories/page.tsx](../app/categories/page.tsx) と [app/categories/[id]/page.tsx](../app/categories/%5Bid%5D/page.tsx) を実装。記事詳細にカテゴリリンクを追加。
  - **ナビ追加:** [app/layout.tsx](../app/layout.tsx) にヘッダー（Home / Categories）を追加。
  - **フィード/サイトマップ:** [app/rss.xml/route.ts](../app/rss.xml/route.ts), [app/atom.xml/route.ts](../app/atom.xml/route.ts), [app/sitemap.ts](../app/sitemap.ts) を追加。サイトURL解決の [lib/site.ts](../lib/site.ts) を新規作成。
  - **ドラフトプレビュー対応:** [app/blogs/[id]/page.tsx](../app/blogs/%5Bid%5D/page.tsx) で `searchParams.draftKey` に対応。 [app/api/preview/route.ts](../app/api/preview/route.ts) を追加し `PREVIEW_SECRET` 検証、相対 `redirect` を絶対URL化、`runtime="nodejs"` を設定。`redirect`に`draftKey`が含まれる場合は `draftMode().enable()` をスキップして安定化。
  - **Next.js 16対応:** 動的ルートで `params` を `await` して使用するよう修正。
  - **型拡張:** [types/post.ts](../types/post.ts) に `category` フィールドを追加し、動的フィールドを許容。
  - **画像許可:** [next.config.ts](../next.config.ts) で `images.microcms-assets.io` を許可。

- `.env.local` に以下を設定
  - `MICROCMS_SERVICE_DOMAIN=u17tqsykhx`
  - `MICROCMS_API_KEY=***`（機密のためVercelにも同値を設定）
- 例ファイル: [.env.local.example](../.env.local.example)

  ## 更新履歴（2026-01-16）
  - **プロフィールページの静的化:** [app/profile/page.tsx](../app/profile/page.tsx) を microCMS 依存なしの静的コンテンツ＋`SkillMap` 表示に変更。
  - **職務経歴のHTML対応:** [app/profile/work-history/page.tsx](../app/profile/work-history/page.tsx) で `career` の「主な業務」「経験」「その他」をサニタイズしたHTMLとして描画。
  - **ブログ一覧ページ追加:** [app/blogs/page.tsx](../app/blogs/page.tsx) を追加し、`page` / `limit` クエリによるページングを実装。
  - **タグ機能追加:** [types/tag.ts](../types/tag.ts) と `tags` エンドポイントを追加し、[components/TagList.tsx](../components/TagList.tsx), [app/tags/page.tsx](../app/tags/page.tsx), [app/tags/[id]/page.tsx](../app/tags/%5Bid%5D/page.tsx) を実装。
  - **Post型のタグ配列対応:** [types/post.ts](../types/post.ts) で `tag` を複数参照（配列）に変更し、[components/PostCard.tsx](../components/PostCard.tsx) と [app/blogs/[id]/page.tsx](../app/blogs/%5Bid%5D/page.tsx) で複数タグ表示に対応。
  - **README整理:** [README.md](../README.md) にタグ機能・ブログ一覧・プロフィール/職務経歴の仕様を追記。

## microCMS スキーマ
- API: `blogs`
- 推奨フィールド
  - `title`（Text）
  - `content`（Rich Text / HTML）
  - `eyecatch`（Image）
  - `category`（Reference -> `categories`）
  - `tag`（Reference（複数可）-> `tags`）
  - `publishedAt`（Date 任意）
- API: `categories`
  - `name`（Text）: カテゴリ名
- API: `tags`
  - `tag`（Text）: タグ名
- API: `comments`
  - `postId` / `name` / `email` / `message` / `deleteToken` など
- API: `career`
  - 期間 / 会社名 / 業種 / 主な業務 / 経験 / その他 など

## ルーティングとページ
- ホーム: [app/page.tsx](../app/page.tsx)
  - `blogs`一覧を取得しカード表示。フェッチ失敗時は空配列で安全に表示。
- ブログ一覧: [app/blogs/page.tsx](../app/blogs/page.tsx)
  - `page` / `limit` クエリでページング可能なブログ一覧ページ（デフォルト9件/ページ）。
- 詳細: [app/blogs/[id]/page.tsx](../app/blogs/%5Bid%5D/page.tsx)
  - `generateStaticParams()`でID一覧を取得（失敗時は空配列でビルド継続）。
  - Next.js 16 仕様に準拠し、`params` は `await` でアンラップして使用。
  - 本文は `content → body → text → description → richtext → html` の順で自動検出。
  - HTMLはサニタイズして描画（XSSなど対策）。
  - タイトル下にカテゴリとタグ（複数）へのリンクを表示。
- カテゴリ一覧: [app/categories/page.tsx](../app/categories/page.tsx)
  - `categories` エンドポイントからカテゴリ一覧を取得して表示。
- カテゴリ詳細: [app/categories/[id]/page.tsx](../app/categories/%5Bid%5D/page.tsx)
  - 指定カテゴリに紐づく記事一覧を表示。
- タグ一覧: [app/tags/page.tsx](../app/tags/page.tsx)
  - `tags` エンドポイントからタグ一覧を取得し、タグごとの記事数を表示。
- タグ詳細: [app/tags/[id]/page.tsx](../app/tags/%5Bid%5D/page.tsx)
  - 指定タグに紐づく記事一覧を表示。
- プロフィール: [app/profile/page.tsx](../app/profile/page.tsx)
  - プロフィール本文・基本情報・Skills（`SkillMap`）を静的に表示。
- 職務経歴: [app/profile/work-history/page.tsx](../app/profile/work-history/page.tsx)
  - `career` エンドポイントから職務経歴を取得し、「主な業務」「経験」「その他」は HTML サニタイズ後に描画。

## データ取得・クライアント
- microCMSクライアント: [lib/microcms.ts](../lib/microcms.ts)
  - `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を zod で検証。
  - `createClient()` でSDKインスタンス生成。
- 型: [types/post.ts](../types/post.ts)
  - カテゴリ参照と複数タグ参照（配列）を持つ `Post` 型を定義し、動的フィールドに対応できるようインデックスシグネチャも許容。
*** End Patch

## セキュリティ（サニタイズ）
- サニタイズユーティリティ: [lib/sanitize.ts](../lib/sanitize.ts)
  - `sanitize-html` を用いて、主要タグ・属性のみ許可。
  - `a` タグには `rel="noopener noreferrer nofollow"` を付与。
- 詳細ページでは `sanitizeHTML(html)` を通してから `dangerouslySetInnerHTML` で描画。

## 画像設定
- Next.jsの画像リモート許可: [next.config.ts](../next.config.ts)
  - `images.microcms-assets.io` を許容。

## 開発・デバッグ
- 起動（デバッグ無し）
```bash
npm run dev
```
- Node Inspectorにアタッチ（既存設定）
  - VS Code: [.vscode/launch.json](../.vscode/launch.json)
  - デバッガーポートは起動時の環境により `9230` など。競合時は `lsof` と `kill` で解消。

## ビルド・デプロイ
- ビルド
```bash
npm run build
```
- Vercel デプロイ
  - プロジェクト設定の Environment Variables に `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を登録。
  - ISRは `revalidate = 60`（60秒）で再生成。

## 実施した主な修正
- エンドポイントを `posts` → `blogs` に変更。
- フェッチの失敗時にもビルドが通るよう、try/catch で空配列を返す堅牢化。
- Next.js 16 の動的 `params` を `await` でアンラップする形に修正。
- 本文フィールドの自動検出ロジックを追加。
- `sanitize-html` を導入してHTMLサニタイズを適用。
- README更新（`blogs`参照に統一）、`.github/copilot-instructions.md` のHTMLコメント削除。

## 既知の注意点・運用提案
- Markdown運用の場合は、別途 Markdown → HTML の変換（`remark` / `marked`）を導入可能。
- 旧ルート `/posts` が不要なら削除してルートを統一（開発サーバ停止後に削除推奨）。
- 許可タグ・属性は要件に応じて拡張可能（`table`/`code`/`pre` など）。

## 次の拡張候補
- 検索機能（キーワード検索・カテゴリ/タグ絞り込みのUI統合）
- 関連記事表示（同カテゴリ・同タグベース）
- OG画像生成（ブログ記事ごとの動的OG画像）

---
## カテゴリ一覧・詳細ページを追加
カテゴリ一覧・詳細ページを追加し、フィルタ表示を実装します。型の追加とページ作成、必要ならリンクも最小限で入れます。

my_app/my_test_blog/types/category.ts が作成されました

my_app/my_test_blog/app/categories/page.tsx が作成されました

my_app/my_test_blog/app/categories/%5Bid%5D/page.tsx が作成されました

要点をまとめます。

- 追加/変更
  - 新規: category.ts — `Category`型を定義
  - 型拡張: post.ts — `category?: { id; name? }` を追加
  - 一覧: page.tsx — カテゴリ一覧（`categories`エンドポイント）を表示
  - 詳細: [app/categories/[id]/page.tsx](app/categories/%5Bid%5D/page.tsx) — カテゴリ詳細＋該当ブログ一覧を表示
    - `filters=category[equals]{id}` で `blogs` を絞り込み
    - `generateStaticParams()`でカテゴリIDをSSG化、ISRは60秒
  - 連携: [app/blogs/[id]/page.tsx](app/blogs/%5Bid%5D/page.tsx) — 記事詳細にカテゴリへのリンクを追加
  - ナビ: layout.tsx — ヘッダーに「Home / Categories」ナビを追加
  - サニタイズ型: `sanitize-html` 導入済み、型定義 `@types/sanitize-html` 追加

- ビルド結果
  - `blogs`と`categories`のSSGが生成され、ISR=60秒で再生成
  - ルート一覧に`/categories`と`/categories/[id]`が追加され、フィルタ表示が有効

- 使い方
  - カテゴリ一覧: /categories
  - カテゴリ詳細（絞り込み）: /categories/{categoryId}
  - 記事詳細からカテゴリリンクで遷移可能

- 補足
  - 旧`/posts/[id]`がルート一覧に残っています。完全に一本化する場合、開発サーバ停止後にpostsディレクトリを削除できます。

---

## RSS/Atomフィードとサイトマップを追加
RSS/Atomフィードとサイトマップを追加します。サイトURL取得ヘルパーを作り、sitemapと各XMLルートを実装します。

以下のURLで配信されます。

- フィード
  - RSS: /rss.xml
  - Atom: /atom.xml
- サイトマップ
  - /sitemap.xml

実装ポイント
- サイトURL解決: site.ts
  - `NEXT_PUBLIC_SITE_URL` → `SITE_URL` → `https://${VERCEL_URL}` → `http://localhost:3000` の順で決定
- サイトマップ: sitemap.ts
  - トップ、カテゴリ一覧、各ブログ記事、各カテゴリ詳細を出力
  - `revalidate = 60`（60秒）で再生成
- RSS: route.ts
  - RSS 2.0。最新50件（`blogs`）を配信
  - 本文は`content`をサニタイズして`description`にCDATA埋め込み
- Atom: route.ts
  - Atom 1.0。最新50件を配信
  - 本文は`content type="html"`でCDATA埋め込み
- サニタイズ: sanitize.ts
  - `sanitize-html`で安全化（主要タグ/属性を許可）
- 依存追加
  - `sanitize-html`
  - 型定義 `@types/sanitize-html`

使い方と運用
- 本番URLで正しい絶対URLにするため、Vercelのプロジェクト環境変数に`NEXT_PUBLIC_SITE_URL`（例: https://your-domain.com）を設定してください。
- 生成件数やURL対象（例: ページング、他の固定ページ等）を増やす場合はお知らせください。

確認
- ローカルで下記にアクセスして内容をご確認ください。
  - http://localhost:3000/sitemap.xml
  - http://localhost:3000/rss.xml
  - http://localhost:3000/atom.xml

調整リクエスト（任意）
- 項目拡張（概要/サマリー、著者、カテゴリの出力）
- 件数・並び順の変更
- robots.txtへのサイトマップ追記（/robots.txt）
