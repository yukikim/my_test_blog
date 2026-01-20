'use client';

import { useEffect, useMemo, useState } from 'react';

type Item = { id: string; name?: string; message: string; createdAt?: string };

type Props = { postId: string };

function getStoredDeleteTokens(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem('commentDeleteTokens') || '{}'); } catch { return {}; }
}
function setStoredDeleteToken(id: string, token: string) {
  const map = getStoredDeleteTokens();
  map[id] = token;
  localStorage.setItem('commentDeleteTokens', JSON.stringify(map));
}
function hasDeleteToken(id: string) {
  const map = getStoredDeleteTokens();
  return !!map[id];
}
function getDeleteToken(id: string) {
  const map = getStoredDeleteTokens();
  return map[id];
}

export default function CommentsList({ postId }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'failed');
      setItems(data.items || []);
    } catch (e: any) {
      setError(e?.message || 'failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onUpdated = (e: Event) => {
      // If event carries id and token, store it
      try {
        const detail = (e as CustomEvent).detail as { id?: string; deleteToken?: string } | undefined;
        if (detail?.id && detail?.deleteToken) setStoredDeleteToken(detail.id, detail.deleteToken);
      } catch {}
      load();
    };
    window.addEventListener('comments:updated', onUpdated as EventListener);
    return () => window.removeEventListener('comments:updated', onUpdated as EventListener);
  }, [postId]);

  async function onDelete(id: string) {
    const token = getDeleteToken(id);
    if (!token) return;
    const ok = confirm('このコメントを削除しますか？');
    if (!ok) return;
    const res = await fetch('/api/comments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, deleteToken: token }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert(data.error || '削除に失敗しました');
    }
  }

  if (loading && items.length === 0) return <p className="text-zinc-500">読み込み中…</p>;
  if (error) return <p className="text-red-700">{error}</p>;

  return (
    <section className='border-b border-teal-700 pb-4'>
      <h2 className="mb-4 text-xl font-semibold">コメント一覧</h2>
      {items.length === 0 ? (
        <p className="text-zinc-500">コメントはまだありません。</p>
      ) : (
        <ul className="space-y-4">
          {items.map((c) => (
            <li key={c.id} className="rounded border p-4 bg-white">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{c.name || '名無し'}</span>
                <span className="text-xs text-zinc-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-word">{c.message}</p>
              {hasDeleteToken(c.id) && (
                <button onClick={() => onDelete(c.id)} className="mt-3 text-sm text-red-700 hover:underline">このコメントを削除</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
