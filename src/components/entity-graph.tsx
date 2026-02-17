'use client';

export function EntityGraph({ entities }: { entities: { value: string; weight: number }[] }) {
  if (!entities.length) return null;
  return (
    <div className="rounded border border-white/10 p-3">
      <div className="mb-2 font-mono text-xs text-paper/70">Graph View</div>
      <svg viewBox="0 0 320 180" className="h-44 w-full">
        {entities.slice(0, 8).map((entity, i) => {
          const x = 30 + (i % 4) * 70;
          const y = 30 + Math.floor(i / 4) * 70;
          return (
            <g key={entity.value}>
              <circle cx={x} cy={y} r={12 + entity.weight * 2} fill="rgba(160,120,75,0.32)" stroke="rgba(236,232,221,0.55)" />
              <text x={x} y={y + 24} textAnchor="middle" fill="#ece8dd" fontSize="9">{entity.value.slice(0, 8)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
