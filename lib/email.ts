import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.COMMENTS_TO_EMAIL;
const fromEmail = process.env.COMMENTS_FROM_EMAIL || "onboarding@resend.dev"; // default for testing

export type CommentPayload = {
  postId: string;
  name?: string;
  email?: string;
  message: string;
};

export async function sendCommentEmail(payload: CommentPayload) {
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");
  if (!toEmail) throw new Error("Missing COMMENTS_TO_EMAIL");

  const resend = new Resend(apiKey);
  const subject = `[Blog Comment] Post ${payload.postId}`;
  const text = [
    `Post: ${payload.postId}`,
    `Name: ${payload.name || "(no name)"}`,
    `Email: ${payload.email || "(no email)"}`,
    "Message:",
    payload.message,
  ].join("\n");

  const result = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject,
    text,
  });
  return result;
}
