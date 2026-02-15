import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { addDiscussionComment, addDiscussionFile, addDiscussionLink } from '@/lib/archive-actions';

export default async function ArchiveDiscussionPage({ params }: { params: { id: string } }) {
  const discussion = await prisma.discussion.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      category: true,
      files: { where: { status: 'approved' }, orderBy: { createdAt: 'desc' } },
      links: { where: { status: 'approved' }, orderBy: { createdAt: 'desc' } },
      comments: { where: { isDeleted: false }, include: { author: true }, orderBy: { createdAt: 'asc' } }
    }
  });

  if (!discussion) notFound();

  return (
    <div className="space-y-4">
      <article className="dossier-card">
        <h1 className="text-2xl">{discussion.title}</h1>
        <p className="text-sm text-paper/70">{discussion.category.name} · {discussion.author.name}</p>
        <p className="mt-3">{discussion.description}</p>
      </article>

      <section className="dossier-card">
        <h2 className="mb-2">Вложения (approved)</h2>
        <ul className="space-y-1 text-sm">
          {discussion.files.map((f) => <li key={f.id}><a href={f.url} target="_blank">{f.name}</a> ({Math.round(f.size / 1024)} KB)</li>)}
        </ul>
      </section>

      <section className="dossier-card">
        <h2 className="mb-2">Ссылки (approved)</h2>
        <ul className="space-y-1 text-sm">
          {discussion.links.map((l) => <li key={l.id}><a href={l.url} target="_blank">{l.title}</a> · {l.platform}</li>)}
        </ul>
      </section>

      <section className="dossier-card space-y-2">
        <h2 className="text-sm font-mono">Добавить файл (автор обсуждения/админ)</h2>
        <form action={addDiscussionFile} className="space-y-2" encType="multipart/form-data">
          <input type="hidden" name="discussionId" value={discussion.id} />
          <input type="file" name="file" required className="block text-sm" />
          <button className="rounded border border-white/20 px-3 py-1">Загрузить</button>
        </form>

        <h2 className="pt-2 text-sm font-mono">Добавить ссылку</h2>
        <form action={addDiscussionLink} className="space-y-2">
          <input type="hidden" name="discussionId" value={discussion.id} />
          <input name="url" type="url" required className="w-full rounded bg-graphite p-2" placeholder="https://..." />
          <input name="title" className="w-full rounded bg-graphite p-2" placeholder="Заголовок" />
          <button className="rounded border border-white/20 px-3 py-1">Добавить ссылку</button>
        </form>
      </section>

      <section className="dossier-card">
        <h2 className="mb-2">Комментарии</h2>
        <form action={addDiscussionComment} className="space-y-2">
          <input type="hidden" name="discussionId" value={discussion.id} />
          <textarea name="content" required className="h-24 w-full rounded bg-graphite p-2" placeholder="Текст, цитаты, таймкоды 01:23" />
          <button className="rounded border border-white/20 px-3 py-1">Отправить</button>
        </form>
        <div className="mt-4 space-y-2">
          {discussion.comments.map((c) => (
            <div key={c.id} className="rounded border border-white/10 p-2">
              <div className="font-mono text-xs text-paper/60">{c.author.name}</div>
              <p>{c.content ?? c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
