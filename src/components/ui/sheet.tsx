'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Sheet({ open, onClose, children }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  return (
    <>
      {open ? (
        <button
          aria-label="Close sheet"
          className="fixed inset-0 z-40 bg-[var(--bg)]"
          style={{ opacity: 0.7 }}
          onClick={onClose}
          type="button"
        />
      ) : null}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border border-[var(--accent)] border-opacity-20 bg-[var(--surface)] transition-transform duration-300',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {children}
      </div>
    </>
  );
}
