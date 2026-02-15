import { prisma } from '@/lib/prisma';
import { adminApproveFile, adminApproveLink } from '@/lib/archive-actions';

export default async function AdminPage() {
  const [reports, users, logs, pendingFiles, pendingLinks] = await Promise.all([
    prisma.report.findMany({ where: { status: 'OPEN' }, take: 50, orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ where: { reputation: { gte: 800 }, approvedUnderSeal: false }, take: 50 }),
    prisma.auditLog.findMany({ take: 50, orderBy: { createdAt: 'desc' } }),
    prisma.file.findMany({ where: { status: 'pending' }, include: { discussion: true }, take: 100, orderBy: { createdAt: 'desc' } }),
    prisma.link.findMany({ where: { status: 'pending' }, include: { discussion: true }, take: 100, orderBy: { createdAt: 'desc' } })
  ]);

  return (
    <div className="space-y-4">
      <section className="dossier-card"><h2 className="mb-2">Open Reports</h2>{reports.map((r) => <div key={r.id} className="text-sm">{r.reason}</div>)}</section>
      <section className="dossier-card"><h2 className="mb-2">Under Seal Approvals</h2>{users.map((u) => <div key={u.id} className="text-sm">{u.name} ({u.reputation})</div>)}</section>
      <section className="dossier-card"><h2 className="mb-2">Archive Files Pending</h2>{pendingFiles.map((f) => (
        <div key={f.id} className="mb-2 rounded border border-white/10 p-2 text-sm">
          <div>{f.name} · {f.discussion.title}</div>
          <div className="mt-1 flex gap-2">
            <form action={async () => { 'use server'; await adminApproveFile(f.id, true); }}><button className="rounded border border-white/20 px-2 py-1">Approve</button></form>
            <form action={async () => { 'use server'; await adminApproveFile(f.id, false); }}><button className="rounded border border-burgundyMuted/60 px-2 py-1">Reject</button></form>
          </div>
        </div>
      ))}</section>
      <section className="dossier-card"><h2 className="mb-2">Archive Links Pending</h2>{pendingLinks.map((l) => (
        <div key={l.id} className="mb-2 rounded border border-white/10 p-2 text-sm">
          <div>{l.title} ({l.platform}) · {l.discussion.title}</div>
          <div className="mt-1 flex gap-2">
            <form action={async () => { 'use server'; await adminApproveLink(l.id, true); }}><button className="rounded border border-white/20 px-2 py-1">Approve</button></form>
            <form action={async () => { 'use server'; await adminApproveLink(l.id, false); }}><button className="rounded border border-burgundyMuted/60 px-2 py-1">Reject</button></form>
          </div>
        </div>
      ))}</section>
      <section className="dossier-card"><h2 className="mb-2">Audit Logs</h2>{logs.map((l) => <div key={l.id} className="font-mono text-xs">{l.action}</div>)}</section>
    </div>
  );
}
