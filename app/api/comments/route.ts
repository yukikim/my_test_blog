import { NextResponse } from "next/server";
import { createComment, deleteComment, getCommentDetail, listComments } from "@/lib/comments";

export const runtime = "nodejs";

async function verifyRecaptcha(token: string | undefined, ip?: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const debug = process.env.RECAPTCHA_DEBUG === "true";
  if (!secret) return { ok: true, score: 1 }; // 未設定時はスキップ（開発用）
  if (!token) return { ok: false, score: 0 };
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = await res.json();
  if (debug) {
    const errs = Array.isArray(data["error-codes"]) ? data["error-codes"].join(",") : "";
    console.log(
      `[reCAPTCHA] success=${data.success} score=${data.score} action=${data.action} hostname=${data.hostname} errors=${errs}`
    );
  }
  return { ok: !!data.success, score: typeof data.score === "number" ? data.score : 0 } as { ok: boolean; score: number };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId") || "";
  if (!postId) return NextResponse.json({ ok: false, error: "postId is required" }, { status: 400 });
  const comments = await listComments(postId);
  return NextResponse.json({ ok: true, items: comments });
}

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0] || undefined;
    const body = await req.json();
    const { postId, name, email, message, recaptchaToken } = body || {};

    if (!postId || typeof postId !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid postId" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ ok: false, error: "Message is required" }, { status: 400 });
    }

    const recaptcha = await verifyRecaptcha(recaptchaToken, ip);
    const rawMin = process.env.RECAPTCHA_MIN_SCORE;
    const parsed = rawMin ? Number.parseFloat(rawMin) : NaN;
    const minScore = Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.5;
    if (process.env.RECAPTCHA_DEBUG === "true") {
      console.log(`[reCAPTCHA] decision ok=${recaptcha.ok} score=${recaptcha.score} min=${minScore}`);
    }
    if (!recaptcha.ok || recaptcha.score < minScore) {
      return NextResponse.json({ ok: false, error: "reCAPTCHA verification failed" }, { status: 400 });
    }

    const created = await createComment({ postId, name, email, message });
    return NextResponse.json({ ok: true, id: created.id, deleteToken: created.deleteToken });
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, deleteToken } = body || {};
    if (!id || typeof id !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }
    if (!deleteToken || typeof deleteToken !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid deleteToken" }, { status: 400 });
    }
    const detail = await getCommentDetail(id);
    if (!detail || detail.deleteToken !== deleteToken) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }
    await deleteComment(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
