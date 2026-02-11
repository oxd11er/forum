import { prisma } from '@/lib/prisma';
import { suggestEquivalences } from '@/lib/puzzle';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ComparePage({ searchParams }: { searchParams: { terms?: string } }) {
  const termsRaw = searchParams.terms ?? '';
  const terms = termsRaw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5);
  const tokens = await prisma.puzzleToken.findMany({ where: { isActive: true }, select: { id: true, token: true, normalized: true, languageCode: true } });
  const suggestions = terms.length ? suggestEquivalences(terms, tokens) : [];

  const session = await getServerSession(authOptions);
  if (session?.user?.email && suggestions.length) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      const matched = tokens.filter((t) => suggestions.some((s) => s.candidate === t.token && s.languageCode === t.languageCode));
      await Promise.all(matched.map((m) => prisma.userPuzzleProgress.upsert({ where: { userId_tokenId: { userId: user.id, tokenId: m.id } }, update: {}, create: { userId: user.id, tokenId: m.id } })));
    }
  }

  return (
    <div className="dossier-card">
      <h1 className="mb-2 text-lg">Compare Terms</h1>
      <p className="mb-3 text-sm text-paper/75">Paste 2–5 terms (comma separated). These terms may be related.</p>
      <form className="mb-4 flex gap-2">
        <input name="terms" defaultValue={termsRaw} className="flex-1 rounded bg-graphite p-2" placeholder="iesus, иисус, yesu" />
        <button className="rounded border border-white/20 px-3">Compare</button>
      </form>
      <ul className="space-y-1 text-sm">
        {suggestions.map((s, i) => <li key={`${s.source}-${i}`}>{s.source} → {s.candidate} ({s.languageCode}) · {s.confidence}</li>)}
      </ul>
    </div>
  );
}
