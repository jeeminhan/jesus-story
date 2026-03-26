import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'ghost' | 'tertiary';
type ButtonSize = 'default' | 'sm' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-[var(--accent)] text-[var(--text-primary)] hover:opacity-90',
  ghost:
    'border border-[var(--accent)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent)] hover:bg-opacity-10',
  tertiary:
    'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline-offset-4 hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2 text-sm rounded-lg',
  sm: 'h-8 px-3 text-xs rounded-md',
  lg: 'h-12 px-6 text-base rounded-xl',
};

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  )
);
Button.displayName = 'Button';

export { Button };
