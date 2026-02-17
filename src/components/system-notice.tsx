'use client';

import { useEffect, useState } from 'react';

const notices = ['PATTERN DENSITY ↑', 'LINKS UNSTABLE', 'ARCHIVE SEALED'];

export function SystemNotice() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const roll = Math.random();
    if (roll <= 0.02) {
      setNotice(notices[Math.floor(Math.random() * notices.length)]);
    }
  }, []);

  if (!notice) return null;

  return <div className="mt-4 rounded border border-burgundyMuted/40 bg-burgundyMuted/10 p-2 font-mono text-xs">{notice}</div>;
}
