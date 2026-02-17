import { prisma } from '@/lib/prisma';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; entity?: string } }) {
  const q = searchParams.q?.trim() ?? '';
  const entity = searchParams.entity?.trim() ?? '';

  const threads = await prisma.thread.findMany({
    where: {
      isDeleted: false,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { body: { contains: q, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(entity ? { entities: { some: { entity: { normalized: entity.toLowerCase() } } } } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="dossier-card">
      <form className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search archive" className="flex-1 rounded bg-graphite p-2" />
        <input name="entity" defaultValue={entity} placeholder="Entity" className="rounded bg-graphite p-2" />
        <button className="rounded border border-white/20 px-3">Search</button>
      </form>
      <ul className="space-y-2 text-sm">
        {threads.map((t) => <li key={t.id}><a href={`/t/${t.id}`}>{t.title}</a></li>)}
      </ul>
    </div>
  );
}
