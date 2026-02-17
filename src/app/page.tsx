import { prisma } from '@/lib/prisma';
import { ThreadCard } from '@/components/thread-card';
import { ThreadComposer } from '@/components/thread-composer';

export default async function HomePage() {
  const [threads, categories] = await Promise.all([
    prisma.thread.findMany({ where: { isDeleted: false, OR: [{ isEphemeral: false }, { expiresAt: { gt: new Date() } }] }, include: { anomaly: true }, orderBy: { createdAt: 'desc' }, take: 25 }),
    prisma.category.findMany({ where: { kind: 'FORUM' }, orderBy: { accessLevel: 'asc' } })
  ]);

  return (
    <div>
      <div className="mb-3 flex gap-2 text-xs font-mono text-paper/70"><span>FILTERS:</span><span>New</span><span>Top</span><span>Anomaly</span></div>
      <ThreadComposer categories={categories} />
      <div className="space-y-3">
        {threads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}
      </div>
    </div>
  );
}
