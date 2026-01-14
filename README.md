This is a Next.js + microCMS blog project bootstrapped with create-next-app.

## Setup

1) Create microCMS Service and API Schema

- Create a `blogs` API in microCMS
	- Fields example: `title (Text)`, `body (Rich Text)`, `eyecatch (Image)`

2) Environment Variables

- Copy `.env.local.example` to `.env.local` and set values:

```
MICROCMS_SERVICE_DOMAIN=your-service
MICROCMS_API_KEY=your-api-key
RESEND_API_KEY=your-resend-key
COMMENTS_TO_EMAIL=owner@example.com
COMMENTS_FROM_EMAIL=onboarding@resend.dev
```

3) Install dependencies

```bash
npm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Homepage lists blogs from microCMS. Create contents in microCMS to see items.
## Comments (Stored + reCAPTCHA)

This project stores comments in microCMS and displays them on each blog page.

- API: `/api/comments`
	- `GET ?postId=...`: List comments
	- `POST { postId, name?, email?, message, recaptchaToken }`: Create comment
	- `DELETE { id, deleteToken }`: Delete own comment
- UI:
	- `CommentsList` shows existing comments and allows deletion if you have the delete token.
	- `CommentForm` posts new comments and handles reCAPTCHA v3.

Environment variables:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret
RECAPTCHA_MIN_SCORE=0.5
RECAPTCHA_DEBUG=true
MICROCMS_SERVICE_DOMAIN=your-service
MICROCMS_API_KEY=read-api-key
MICROCMS_WRITE_API_KEY=write-api-key
```

microCMS setup:
- Create a `comments` API with fields: `postId (Text)`, `name (Text)`, `email (Text)`, `message (Text Area)`, `deleteToken (Text)`.
 - Enable Write API in microCMS and generate a Write-enabled API key.
 - Use `MICROCMS_API_KEY` for read operations and `MICROCMS_WRITE_API_KEY` for create/delete.

Notes:
- Delete is authorized by a random `deleteToken` stored only on the device used to post.
- For better auth, integrate a user system or admin moderation as needed.
- Adjust sensitivity via `RECAPTCHA_MIN_SCORE` (0.0–1.0, default 0.5). Higher blocks more likely bots; lower is more permissive.
- Enable server-side logging with `RECAPTCHA_DEBUG=true` to print verification results (success, score, action, hostname, errors) in server logs.


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Vercel: yukikim_v's projects (Hobby)

https://my-test-blog-six.vercel.app/

Blog title

The Archive of Oblivion：「忘却の記録」

忘却の記録 ｜ ポンコツウエットウエアの備忘録
