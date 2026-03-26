'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ToasterProps = React.HTMLAttributes<HTMLDivElement>;

export function Toaster({ className, ...props }: ToasterProps) {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className={cn('pointer-events-none fixed right-4 top-4 z-[100] space-y-2', className)}
      {...props}
    />
  );
}
