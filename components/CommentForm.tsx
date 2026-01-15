'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

type Props = { postId: string };

export default function CommentForm({ postId }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);
  
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!recaptchaToken) {
      setError('reCAPTCHAのチェックを完了してください。');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, name, email, message, recaptchaToken }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) {
        throw new Error(data.error || '送信に失敗しました');
      }
      
      // 保存: この端末から投稿したコメントの削除トークンを保持
      try {
        const map = JSON.parse(localStorage.getItem('commentDeleteTokens') || '{}');
        if (data.id && data.deleteToken) {
          map[data.id] = data.deleteToken;
          localStorage.setItem('commentDeleteTokens', JSON.stringify(map));
        }
      } catch {}
      
      // リストへ更新イベントを通知
      window.dispatchEvent(new CustomEvent('comments:updated', { detail: { id: data.id, deleteToken: data.deleteToken } }));
      
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || '送信に失敗しました');
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">コメント</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">お名前 (任意)</label>
            <input className="w-full rounded border p-2 bg-white" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">メール (任意)</label>
            <input type="email" className="w-full rounded border p-2 bg-white" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">メッセージ *</label>
          <textarea className="w-full rounded border p-2 bg-white" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        
        {siteKey && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            onChange={setRecaptchaToken}
          />
        )}

        <button disabled={status === 'loading'} className="rounded bg-teal-600 text-white px-4 py-2 disabled:opacity-50">
          {status === 'loading' ? '送信中…' : '送信'}
        </button>
        
        {status === 'success' && <p className="text-green-700 mt-2">送信しました。</p>}
        {status === 'error' && <p className="text-red-700 mt-2">{error}</p>}
      </form>
    </section>
  );
}
