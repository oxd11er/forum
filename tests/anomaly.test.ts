import { describe, expect, it } from 'vitest';
import { computeAnomalyScore } from '@/lib/anomaly';

describe('computeAnomalyScore', () => {
  it('computes explainable positive score', () => {
    const result = computeAnomalyScore({ uniqueEntities: 5, numEntities: 8, crossLinks: 3, penalties: 0.2, reasons: ['x'] });
    expect(result.score).toBeGreaterThan(0);
    expect(result.factors.uniqueEntities).toBe(5);
  });
});
