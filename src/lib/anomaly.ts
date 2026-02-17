export interface AnomalyFactors {
  uniqueEntities: number;
  numEntities: number;
  crossLinks: number;
  penalties: number;
  reasons: string[];
}

export function computeAnomalyScore(f: Omit<AnomalyFactors, 'reasons'> & { reasons?: string[] }) {
  const reasons = f.reasons ?? [];
  const score = Math.log(1 + f.uniqueEntities * f.numEntities) + Math.log(1 + f.crossLinks) - f.penalties;
  return {
    score: Number(Math.max(0, score).toFixed(4)),
    factors: { ...f, reasons }
  };
}
