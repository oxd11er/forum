export function normalizeToken(token: string) {
  return token
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

function similarity(a: string, b: string) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const short = a.length < b.length ? a : b;
  const long = a.length < b.length ? b : a;
  let match = 0;
  for (const ch of short) if (long.includes(ch)) match++;
  return match / long.length;
}

export function suggestEquivalences(inputTerms: string[], tokens: { token: string; normalized: string; languageCode: string }[]) {
  const normalized = inputTerms.map(normalizeToken).filter(Boolean);
  const suggestions = [] as { source: string; candidate: string; languageCode: string; confidence: number }[];

  for (const source of normalized) {
    for (const token of tokens) {
      const confidence = similarity(source, token.normalized);
      if (confidence >= 0.62) {
        suggestions.push({ source, candidate: token.token, languageCode: token.languageCode, confidence: Number(confidence.toFixed(2)) });
      }
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 25);
}
