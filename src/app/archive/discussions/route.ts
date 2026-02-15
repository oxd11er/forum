import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.discussion.findMany({ orderBy: { createdAt: 'desc' }, include: { category: true, author: { select: { name: true } } } });
  return NextResponse.json({ ok: true, data });
}
