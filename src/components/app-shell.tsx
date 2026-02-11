'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Search, Sigma } from 'lucide-react';
import { SystemNotice } from './system-notice';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [reduceEffects, setReduceEffects] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem('reduce-effects') === '1';
    setReduceEffects(value);
  }, []);

  const className = useMemo(() => (reduceEffects ? '' : 'grain scanlines'), [reduceEffects]);

  return (
    <div className={className}>
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-4 p-4 lg:grid-cols-[240px_1fr_280px]">
        <aside className="rounded-lg border border-white/10 bg-panel p-4">
          <h1 className="font-mono text-xs tracking-[0.35em] text-paper/70">ARCHIVE</h1>
          <nav className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/">Open Archive</Link>
            <Link href="/c/sealed">Sealed</Link>
            <Link href="/c/under-seal">Under Seal</Link>
            <Link href="/search" className="inline-flex items-center gap-2"><Search size={14} />Search</Link>
            <Link href="/protocol">About Protocol</Link>
          </nav>
          <button
            className="mt-6 rounded border border-white/20 px-2 py-1 text-xs"
            onClick={() => {
              const next = !reduceEffects;
              setReduceEffects(next);
              localStorage.setItem('reduce-effects', next ? '1' : '0');
            }}
          >
            Reduce Effects: {reduceEffects ? 'On' : 'Off'}
          </button>
        </aside>
        <main>{children}</main>
        <aside className="rounded-lg border border-white/10 bg-panel p-4 text-sm text-paper/80">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">Context</div>
          <p>Related threads and linked entities are shown per thread.</p>
          <Link href="/compare" className="mt-4 inline-flex items-center gap-1 text-xs"><Sigma size={12} /> Compare Terms</Link>
          <SystemNotice />
        </aside>
      </div>
    </div>
  );
}
