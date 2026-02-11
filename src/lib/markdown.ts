import { remark } from 'remark';
import html from 'remark-html';
import DOMPurify from 'isomorphic-dompurify';

export async function renderSafeMarkdown(markdown: string) {
  const raw = String(await remark().use(html).process(markdown));
  return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
}
