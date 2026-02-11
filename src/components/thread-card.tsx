import Link from 'next/link';

interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    anomaly?: { score: number } | null;
  };
}

export function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <article className="dossier-card">
      <div className="font-mono text-[11px] text-paper/60">CASE #{thread.id.slice(0, 8)} · {thread.createdAt.toISOString()}</div>
      <h2 className="mt-2 text-lg text-paper"><Link href={`/t/${thread.id}`}>{thread.title}</Link></h2>
      <p className="mt-2 line-clamp-3 text-sm text-paper/80">{thread.body}</p>
      <div className="mt-4 grid gap-1 font-mono text-[11px] text-paper/60">
        <span>STATUS: UNVERIFIED</span>
        <span>SOURCE: USER SUBMISSION</span>
        <span>PATTERN DENSITY: {thread.anomaly?.score.toFixed(2) ?? 'N/A'}</span>
      </div>
    </article>
  );
}
