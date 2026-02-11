import { prisma } from './prisma';

export async function runDailyArchivistThread() {
  const archivist = await prisma.user.findUnique({ where: { email: 'archivist@example.local' } });
  const open = await prisma.category.findUnique({ where: { slug: 'open-archive' } });
  if (!archivist || !open) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const existing = await prisma.thread.findFirst({ where: { authorId: archivist.id, isEphemeral: true, createdAt: { gte: today } } });
  if (existing) return;

  await prisma.thread.create({
    data: {
      title: 'Archivist Daily Note',
      body: 'Atmospheric protocol: retain ambiguity, cite sources, avoid certainty claims, maintain calm tone.',
      categoryId: open.id,
      authorId: archivist.id,
      isEphemeral: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });
}

export async function expireEphemeralThreads() {
  await prisma.thread.updateMany({ where: { isEphemeral: true, isDeleted: false, expiresAt: { lt: new Date() } }, data: { isDeleted: true } });
}
