import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { createDiscussion } from '@/lib/archive-actions';

export default async function ArchivePage() {
  const [discussions, categories] = await Promise.all([
    prisma.discussion.findMany({ include: { category: true, author: true, _count: { select: { comments: true, files: true, links: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ where: { kind: 'ARCHIVE' }, orderBy: { name: 'asc' } })
  ]);

  return (
    <div className="space-y-4">
      <div className="dossier-card">
        <h1 className="text-xl">Архив документов</h1>
        <p className="text-sm text-paper/70">Публичный архив обсуждений, файлов и источников.</p>
      </div>

      <form action={createDiscussion} className="dossier-card space-y-2">
        <h2 className="text-sm font-mono text-paper/70">Новое обсуждение (только авторизованные)</h2>
        <input name="title" required placeholder="Название" className="w-full rounded bg-graphite p-2" />
        <textarea name="description" required placeholder="Описание" className="h-24 w-full rounded bg-graphite p-2" />
        <select name="categoryId" className="rounded bg-graphite p-2">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="rounded border border-white/20 px-3 py-1">Создать обсуждение</button>
      </form>

      <div className="space-y-3">
        {discussions.map((d) => (
          <article key={d.id} className="dossier-card">
            <div className="font-mono text-xs text-paper/60">{d.category.name} · {d.createdAt.toISOString()}</div>
            <h2 className="mt-2 text-lg"><Link href={`/archive/discussion/${d.id}`}>{d.title}</Link></h2>
            <p className="mt-2 text-sm text-paper/80">{d.description}</p>
            <p className="mt-2 text-xs text-paper/60">Файлы: {d._count.files} · Ссылки: {d._count.links} · Комментарии: {d._count.comments}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
