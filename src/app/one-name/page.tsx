import { prisma } from '@/lib/prisma';

export default async function OneNamePage() {
  const rows = await prisma.puzzleToken.findMany({ where: { isActive: true }, orderBy: [{ languageCode: 'asc' }, { token: 'asc' }] });
  return (
    <div className="dossier-card">
      <p>The name is the same.</p>
      <p>Across tongues, the reference converges.</p>
      <table className="mt-4 w-full text-left text-sm">
        <thead><tr className="text-paper/60"><th>Lang</th><th>Script</th><th>Token</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id}><td>{r.languageCode}</td><td>{r.script}</td><td>{r.token}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
