import { describe, expect, it } from 'vitest';
import { hasPersonalData } from '@/lib/doxxing';

describe('hasPersonalData', () => {
  it('detects email and RU phone', () => {
    expect(hasPersonalData('contact me at x@test.com')).toBe(true);
    expect(hasPersonalData('номер +7 (900) 123-45-67')).toBe(true);
  });

  it('ignores safe text', () => {
    expect(hasPersonalData('pattern around station archive only')).toBe(false);
  });
});
