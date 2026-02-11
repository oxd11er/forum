import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  const [reports, users, logs] = await Promise.all([
    prisma.report.findMany({ where: { status: 'OPEN' }, take: 50, orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ where: { reputation: { gte: 800 }, approvedUnderSeal: false }, take: 50 }),
    prisma.auditLog.findMany({ take: 50, orderBy: { createdAt: 'desc' } })
  ]);

  return (
    <div className="space-y-4">
      <section className="dossier-card"><h2 className="mb-2">Open Reports</h2>{reports.map((r) => <div key={r.id} className="text-sm">{r.reason}</div>)}</section>
      <section className="dossier-card"><h2 className="mb-2">Under Seal Approvals</h2>{users.map((u) => <div key={u.id} className="text-sm">{u.name} ({u.reputation})</div>)}</section>
      <section className="dossier-card"><h2 className="mb-2">Audit Logs</h2>{logs.map((l) => <div key={l.id} className="font-mono text-xs">{l.action}</div>)}</section>
    </div>
  );
}
