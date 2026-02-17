'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { hasPersonalData, hasViolenceCall } from './doxxing';
import { extractEntities } from './entities';
import { computeAnomalyScore } from './anomaly';
import { rateLimit } from './rate-limit';

function lexemeNormalize(input: string) {
  return input
    .replace(/conspiracy/gi, 'anomaly')
    .replace(/заговор/gi, 'аномалия');
}

export async function createThread(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('Unauthorized');

  const limited = rateLimit(`thread:${user.id}`, 5, 60_000);
  if (!limited.ok) throw new Error('Rate limit exceeded.');

  const title = lexemeNormalize(String(formData.get('title') ?? '').trim());
  const body = lexemeNormalize(String(formData.get('body') ?? '').trim());
  const categoryId = String(formData.get('categoryId'));

  if (hasPersonalData(`${title}\n${body}`)) throw new Error('Personal data cannot be posted.');
  if (hasViolenceCall(`${title}\n${body}`)) throw new Error('Calls to violence/harassment are not allowed.');

  const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });
  if (category.accessLevel === 1 && user.reputation < 200) throw new Error('Sealed archive requires reputation 200.');
  if (category.accessLevel === 2 && (user.reputation < 800 || !user.approvedUnderSeal)) throw new Error('Under Seal requires reputation 800 and approval.');

  const thread = await prisma.thread.create({ data: { title, body, categoryId, authorId: user.id } });
  const entities = extractEntities(`${title} ${body}`);

  for (const entity of entities) {
    const existing = await prisma.entity.findFirst({ where: { normalized: entity.normalized, type: entity.type } });
    const saved = existing ?? (await prisma.entity.create({ data: entity }));
    await prisma.threadEntity.upsert({
      where: { threadId_entityId: { threadId: thread.id, entityId: saved.id } },
      update: { weight: 1 },
      create: { threadId: thread.id, entityId: saved.id, weight: 1 }
    });
  }

  const scoreData = computeAnomalyScore({
    uniqueEntities: new Set(entities.map((e) => e.normalized)).size,
    numEntities: entities.length,
    crossLinks: Math.floor(entities.length / 3),
    penalties: entities.length < 2 ? 0.4 : 0,
    reasons: entities.length < 2 ? ['low entity diversity'] : ['cross-link density estimate']
  });

  await prisma.anomalyScore.create({ data: { threadId: thread.id, score: scoreData.score, factors: scoreData.factors } });
  revalidatePath('/');
}

export async function createComment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('Unauthorized');

  const limited = rateLimit(`comment:${user.id}`, 15, 60_000);
  if (!limited.ok) throw new Error('Rate limit exceeded.');

  const body = lexemeNormalize(String(formData.get('body') ?? '').trim());
  const threadId = String(formData.get('threadId'));
  if (hasPersonalData(body)) throw new Error('Personal data cannot be posted.');
  if (hasViolenceCall(body)) throw new Error('Calls to violence/harassment are not allowed.');

  await prisma.comment.create({ data: { threadId, authorId: user.id, body } });
  revalidatePath(`/t/${threadId}`);
}

export async function recordDiscoveries(tokenIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return;

  for (const tokenId of tokenIds) {
    await prisma.userPuzzleProgress.upsert({
      where: { userId_tokenId: { userId: user.id, tokenId } },
      update: {},
      create: { userId: user.id, tokenId }
    });
  }
}
