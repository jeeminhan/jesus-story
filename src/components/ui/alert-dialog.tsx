'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AlertDialog({ open, onClose, title, description, children }: AlertDialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 85%, transparent)' }}
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby={description ? 'alert-desc' : undefined}
        className={cn(
          'rounded-xl p-6 max-w-sm w-full mx-4',
          'bg-[var(--surface)] border border-[var(--accent)] border-opacity-20'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="alert-title" className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
        {description ? (
          <p id="alert-desc" className="mb-4 text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
