import { EntityType } from '@prisma/client';

const dictionary = ['archive', 'protocol', 'signal', 'pattern', 'coincidence'];

export function extractEntities(text: string) {
  const entities: { type: EntityType; value: string; normalized: string }[] = [];
  const years = text.match(/\b(19|20)\d{2}\b/g) ?? [];
  years.forEach((y) => entities.push({ type: 'DATE', value: y, normalized: y }));

  const mentions = text.match(/@[a-zA-Z0-9_]+/g) ?? [];
  mentions.forEach((m) => entities.push({ type: 'PERSON', value: m, normalized: m.toLowerCase() }));

  const caps = text.match(/\b[A-Z][a-z]{2,}\b/g) ?? [];
  caps.forEach((c) => entities.push({ type: 'TERM', value: c, normalized: c.toLowerCase() }));

  dictionary.forEach((term) => {
    if (text.toLowerCase().includes(term)) {
      entities.push({ type: 'SYMBOL', value: term, normalized: term });
    }
  });

  return dedupeEntities(entities);
}

function dedupeEntities<T extends { normalized: string; type: EntityType }>(rows: T[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.type}:${row.normalized}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
