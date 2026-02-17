import { describe, expect, it } from 'vitest';
import { detectPlatform } from '@/lib/archive';

describe('archive link platform detect', () => {
  it('detects known platforms', () => {
    expect(detectPlatform('https://youtube.com/watch?v=1')).toBe('youtube');
    expect(detectPlatform('https://ru.wikipedia.org/wiki/Test')).toBe('wikipedia');
    expect(detectPlatform('https://rutube.ru/video/1')).toBe('rutube');
  });
});
