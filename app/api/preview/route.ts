import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const secret = searchParams.get("secret") || "";
  const redirectParam = searchParams.get("redirect") || "/";

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new NextResponse("Invalid preview secret", { status: 401 });
  }

  // microCMSのdraftKeyを含む場合は、クッキーによるドラフトモードが不要なためスキップ
  // 直接draftKeyでドラフトを取得できるため、edge/node差異によるdraftModeエラーを回避します。
  if (!redirectParam.includes("draftKey=")) {
    const dm = await draftMode();
    dm.enable();
  }
  const redirectUrl = new URL(redirectParam, url.origin);
  return NextResponse.redirect(redirectUrl);
}
