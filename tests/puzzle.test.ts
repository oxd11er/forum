import { describe, expect, it } from 'vitest';
import { normalizeToken, suggestEquivalences } from '@/lib/puzzle';

describe('puzzle normalization', () => {
  it('normalizes accents and punctuation', () => {
    expect(normalizeToken('Jésus!')).toBe('jesus');
  });

  it('suggests related terms', () => {
    const suggestions = suggestEquivalences(['yesu'], [
      { token: 'Yesu', normalized: 'yesu', languageCode: 'sw' },
      { token: 'Archive', normalized: 'archive', languageCode: 'en' }
    ]);
    expect(suggestions[0]?.candidate).toBe('Yesu');
  });
});
