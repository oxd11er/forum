import { LinkPlatform } from '@prisma/client';

const allowedMime = new Set([
  'application/pdf',
  'text/plain',
  'image/jpeg',
  'image/png',
  'application/zip',
  'application/x-zip-compressed'
]);

const allowedExt = new Set(['pdf', 'txt', 'jpg', 'jpeg', 'png', 'zip']);

export function validateArchiveFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!allowedExt.has(ext)) throw new Error('Unsupported file format.');
  if (!allowedMime.has(file.type) && file.type !== '') throw new Error('Unsupported mime type.');
  if (file.size > 20 * 1024 * 1024) throw new Error('File must be <= 20MB.');
}

export function detectPlatform(url: string): LinkPlatform {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('wikipedia.org')) return 'wikipedia';
  if (u.includes('vk.com/video') || u.includes('vkvideo.ru')) return 'vk';
  if (u.includes('rutube.ru')) return 'rutube';
  if (u.includes('vimeo.com')) return 'vimeo';
  return 'other';
}

export function validateSourceUrl(url: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('Only HTTPS links are allowed.');
}
