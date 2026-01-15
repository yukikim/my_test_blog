const AkismetClient = require('akismet-client');

const akismetKey = process.env.AKISMET_KEY;
const akismetBlog = process.env.AKISMET_BLOG;

let client: any | null = null;
if (akismetKey && akismetBlog) {
  client = new AkismetClient({ key: akismetKey, blog: akismetBlog });
}

type CommentAuthor = {
  ip: string;
  userAgent: string;
  name?: string;
  email?: string;
};

export async function isSpam(author: CommentAuthor, message: string): Promise<boolean> {
  // URLが含まれていればスパムと判定
  if (/(http|https):\/\//.test(message)) {
    console.log('[SPAM] Blocked due to URL in message.');
    return true;
  }

  if (!client) {
    console.warn('[SPAM] Akismet is not configured. Skipping check.');
    return false;
  }

  try {
    const isSpam = await client.checkSpam({
      user_ip: author.ip,
      user_agent: author.userAgent,
      comment_author: author.name,
      comment_author_email: author.email,
      comment_content: message,
    });
    if (isSpam) {
      console.log('[SPAM] Akismet detected spam.');
    }
    return isSpam;
  } catch (err) {
    console.error('[SPAM] Akismet check failed:', err);
    // Akismetのチェックに失敗した場合は、スパムとして扱わない
    return false;
  }
}
