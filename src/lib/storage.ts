import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const endpoint = process.env.YANDEX_STORAGE_ENDPOINT ?? 'https://storage.yandexcloud.net';
const bucket = process.env.YANDEX_STORAGE_BUCKET ?? 'archive-storage';

const s3 = new S3Client({
  region: 'ru-central1',
  endpoint,
  credentials: {
    accessKeyId: process.env.YANDEX_STORAGE_ACCESS_KEY ?? '',
    secretAccessKey: process.env.YANDEX_STORAGE_SECRET_KEY ?? ''
  }
});

export function generatePublicUrl(fileKey: string) {
  return `${endpoint.replace(/\/$/, '')}/${bucket}/${fileKey}`;
}

export async function uploadFile(file: File) {
  const key = `archive/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const body = Buffer.from(await file.arrayBuffer());
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: file.type,
    ACL: 'public-read'
  }));
  return { key, url: generatePublicUrl(key) };
}

export async function deleteFile(fileKey: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: fileKey }));
}
