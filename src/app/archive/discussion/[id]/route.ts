import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await prisma.discussion.findUnique({
    where: { id: params.id },
    include: {
      files: { where: { status: 'approved' } },
      links: { where: { status: 'approved' } },
      comments: { where: { isDeleted: false }, include: { author: { select: { name: true } } } }
    }
  });
  if (!data) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, data });
}
