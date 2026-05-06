import type { ReactNode } from 'react';
import glossary from '@/lib/mock-data/glossary.json';

const dict = glossary as Record<string, string>;

// Wraps a cultural / technical term with the .gl class so the CSS-only
// hover tooltip in globals.css picks up data-en. Non-glossary children
// pass through untouched.
export function T({ children }: { children: ReactNode }) {
  const key = String(children).trim();
  const en = dict[key];
  if (!en) return <>{children}</>;
  return (
    <span className="gl" data-en={en}>
      {children}
    </span>
  );
}
