'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { uploadFile as uploadToStorage, deleteFile as deleteFromStorage } from './storage';
import { detectPlatform, validateArchiveFile, validateSourceUrl } from './archive';

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function createDiscussion(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const categoryId = String(formData.get('categoryId') ?? '');

  const category = await prisma.category.findFirst({ where: { id: categoryId, kind: 'ARCHIVE' } });
  if (!category) throw new Error('Invalid category');

  const discussion = await prisma.discussion.create({ data: { title, description, categoryId, authorId: user.id } });
  revalidatePath('/archive');
  return discussion.id;
}

export async function addDiscussionFile(formData: FormData) {
  const user = await requireUser();
  const discussionId = String(formData.get('discussionId') ?? '');
  const discussion = await prisma.discussion.findUniqueOrThrow({ where: { id: discussionId } });
  if (discussion.authorId !== user.id && user.role !== 'ADMIN') throw new Error('Forbidden');

  const file = formData.get('file');
  if (!(file instanceof File)) throw new Error('No file');
  validateArchiveFile(file);

  const uploaded = await uploadToStorage(file);
  await prisma.file.create({
    data: {
      key: uploaded.key,
      name: file.name,
      url: uploaded.url,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      status: 'pending',
      authorId: user.id,
      discussionId
    }
  });

  revalidatePath(`/archive/discussion/${discussionId}`);
}

export async function addDiscussionLink(formData: FormData) {
  const user = await requireUser();
  const discussionId = String(formData.get('discussionId') ?? '');
  const url = String(formData.get('url') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim() || 'External Source';

  const discussion = await prisma.discussion.findUniqueOrThrow({ where: { id: discussionId } });
  if (discussion.authorId !== user.id && user.role !== 'ADMIN') throw new Error('Forbidden');

  validateSourceUrl(url);
  await prisma.link.create({
    data: {
      url,
      title,
      platform: detectPlatform(url),
      status: 'pending',
      authorId: user.id,
      discussionId
    }
  });

  revalidatePath(`/archive/discussion/${discussionId}`);
}

export async function addDiscussionComment(formData: FormData) {
  const user = await requireUser();
  const discussionId = String(formData.get('discussionId') ?? '');
  const content = String(formData.get('content') ?? '').trim();

  await prisma.comment.create({ data: { discussionId, content, authorId: user.id } });
  revalidatePath(`/archive/discussion/${discussionId}`);
}

export async function adminApproveFile(fileId: string, approve: boolean) {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new Error('Forbidden');

  const file = await prisma.file.findUniqueOrThrow({ where: { id: fileId } });
  if (!approve) {
    await deleteFromStorage(file.key);
    await prisma.file.update({ where: { id: fileId }, data: { status: 'rejected' } });
  } else {
    await prisma.file.update({ where: { id: fileId }, data: { status: 'approved' } });
  }
  revalidatePath('/admin');
}

export async function adminApproveLink(linkId: string, approve: boolean) {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new Error('Forbidden');
  await prisma.link.update({ where: { id: linkId }, data: { status: approve ? 'approved' : 'rejected' } });
  revalidatePath('/admin');
}
