'use client';

import { useState } from 'react';
import { createThread } from '@/lib/actions';

export function ThreadComposer({ categories }: { categories: { id: string; name: string }[] }) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  function transformLexeme(value: string) {
    let next = value;
    if (/conspiracy/i.test(next)) {
      next = next.replace(/conspiracy/gi, 'anomaly');
      setTooltip('Lexeme restricted by protocol.');
    } else if (/заговор/i.test(next)) {
      next = next.replace(/заговор/gi, 'аномалия');
      setTooltip('Лексема ограничена протоколом.');
    }
    return next;
  }

  return (
    <form action={createThread} className="dossier-card mb-4 space-y-2">
      <input name="title" required placeholder="Title" className="w-full rounded bg-graphite p-2" onChange={(e) => (e.currentTarget.value = transformLexeme(e.currentTarget.value))} />
      <textarea name="body" required placeholder="Record your anomaly..." className="h-28 w-full rounded bg-graphite p-2" onChange={(e) => (e.currentTarget.value = transformLexeme(e.currentTarget.value))} />
      <select name="categoryId" className="rounded bg-graphite p-2">
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      {tooltip && <div className="font-mono text-xs text-amberMuted">{tooltip}</div>}
      <button className="rounded border border-amberMuted/40 px-3 py-1 text-sm">Submit dossier</button>
    </form>
  );
}
