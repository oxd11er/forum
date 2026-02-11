import { prisma } from '@/lib/prisma';

export default async function ProtocolPage() {
  const stamps = await prisma.puzzleToken.findMany({ where: { isActive: true }, take: 8, orderBy: { languageCode: 'asc' } });
  return (
    <div className="dossier-card space-y-3">
      <h1 className="text-xl">Protocol</h1>
      <p>This archive tracks patterns, anomalies, and metadata links. Claims are provisional. Harassment, doxxing, and violence are blocked.</p>
      <p>Privacy: personal data cannot be posted. Moderators review reports and audit actions.</p>
      <div>
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">Archive Stamps</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {stamps.map((s) => <span key={s.id} className="rounded border border-white/10 px-2 py-0.5 text-[11px] text-paper/55">{s.token}</span>)}
        </div>
      </div>
    </div>
  );
}
