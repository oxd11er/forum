import { prisma } from '@/lib/prisma';
import { ThreadCard } from '@/components/thread-card';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();
  const threads = await prisma.thread.findMany({ where: { categoryId: category.id, isDeleted: false }, include: { anomaly: true }, orderBy: { createdAt: 'desc' } });

  return <div className="space-y-3">{threads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}</div>;
}
