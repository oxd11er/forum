import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { renderSafeMarkdown } from '@/lib/markdown';
import { createComment } from '@/lib/actions';
import { EntityGraph } from '@/components/entity-graph';

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const thread = await prisma.thread.findUnique({
    where: { id: params.id },
    include: {
      anomaly: true,
      comments: { where: { isDeleted: false }, include: { author: true }, orderBy: { createdAt: 'asc' } },
      entities: { include: { entity: true } }
    }
  });

  if (!thread || thread.isDeleted) notFound();

  const html = await renderSafeMarkdown(thread.body);
  const reasons = (thread.anomaly?.factors as any)?.reasons ?? [];

  return (
    <div className="space-y-4">
      <article className="dossier-card">
        <h1 className="text-2xl">{thread.title}</h1>
        <div className="mt-2 font-mono text-xs text-paper/60">PATTERN DENSITY: {thread.anomaly?.score.toFixed(2) ?? 'N/A'}</div>
        <div className="mt-3 prose prose-invert max-w-none text-paper/90" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-4 rounded border border-white/10 p-2 text-sm">
          <div className="font-mono text-xs text-paper/60">WHY (neutral factors)</div>
          <ul className="list-disc pl-5">
            {reasons.map((r: string) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      </article>

      <section className="dossier-card">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">Extracted Entities</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {thread.entities.map((te) => <span key={te.entityId} className="rounded border border-white/20 px-2 py-1 text-xs">{te.entity.value}</span>)}
        </div>
      </section>

      <EntityGraph entities={thread.entities.map((te) => ({ value: te.entity.value, weight: te.weight }))} />

      <section className="dossier-card">
        <h2 className="mb-3">Comments</h2>
        <form action={createComment} className="mb-4 space-y-2">
          <input type="hidden" name="threadId" value={thread.id} />
          <textarea name="body" required className="h-24 w-full rounded bg-graphite p-2" />
          <button className="rounded border border-white/20 px-3 py-1">Reply</button>
        </form>
        <div className="space-y-3">
          {thread.comments.map((c) => (
            <div key={c.id} className="rounded border border-white/10 p-2">
              <div className="font-mono text-xs text-paper/60">{c.author.name} · {c.createdAt.toISOString()}</div>
              <p className="mt-1 text-sm">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
