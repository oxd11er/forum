import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage({ params }: { params: { name: string } }) {
  const user = await prisma.user.findFirst({ where: { name: params.name }, include: { threads: { take: 15, orderBy: { createdAt: 'desc' } } } });
  if (!user) notFound();

  return (
    <div className="dossier-card">
      <h1 className="text-xl">{user.name}</h1>
      <p className="font-mono text-xs text-paper/60">Reputation: {user.reputation} · Role: {user.role}</p>
      <ul className="mt-4 list-disc pl-5">
        {user.threads.map((t) => <li key={t.id}><a href={`/t/${t.id}`}>{t.title}</a></li>)}
      </ul>
    </div>
  );
}
