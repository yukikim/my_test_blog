# プロジェクト作業概要（Next.js + microCMS + Vercel）

## 概要
- 本プロジェクトは Next.js 16（App Router）と microCMS を用いたブログサイトです。
- デプロイ対象は Vercel。ISR（60秒）で再生成されます。
- エンドポイントは `blogs` に統一し、本文が無いケースにも堅牢に対応しました。

## 技術スタック
- Next.js 16 / React 19 / TypeScript
- microCMS（JavaScript SDK）
- Tailwind CSS
- サニタイズ: sanitize-html（SSRでHTMLを安全化）

## 環境変数
- `.env.local` に以下を設定
  - `MICROCMS_SERVICE_DOMAIN=u17tqsykhx`
  - `MICROCMS_API_KEY=***`（機密のためVercelにも同値を設定）
- 例ファイル: [.env.local.example](../.env.local.example)

## microCMS スキーマ
- API: `blogs`
- 推奨フィールド
  - `title`（Text）
  - `content`（Rich Text / HTML）
  - `eyecatch`（Image）
  - `publishedAt`（Date 任意）

## ルーティングとページ
- ホーム: [app/page.tsx](../app/page.tsx)
  - `blogs`一覧を取得しカード表示。フェッチ失敗時は空配列で安全に表示。
- 詳細: [app/blogs/[id]/page.tsx](../app/blogs/%5Bid%5D/page.tsx)
  - `generateStaticParams()`でID一覧を取得（失敗時は空配列でビルド継続）。
  - Next.js 16 仕様に準拠し、`params` は `await` でアンラップして使用。
  - 本文は `content → body → text → description → richtext → html` の順で自動検出。
  - HTMLはサニタイズして描画（XSSなど対策）。
- カード: [components/PostCard.tsx](../components/PostCard.tsx)
  - 詳細リンクは `/blogs/{id}`。

## データ取得・クライアント
- microCMSクライアント: [lib/microcms.ts](../lib/microcms.ts)
  - `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を zod で検証。
  - `createClient()` でSDKインスタンス生成。
- 型: [types/post.ts](../types/post.ts)
  - 動的フィールドに対応できるよう、インデックスシグネチャを許容。

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
- カテゴリ/タグ一覧・絞り込み
- RSS/サイトマップ生成（SEO）
- 下書きプレビュー（プレビュートークン対応）
- OG画像生成
