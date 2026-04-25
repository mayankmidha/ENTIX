'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  size = 'md',
}: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const iconSize = size === 'sm' ? 14 : 16;
  const textCls = size === 'sm' ? 'text-[13px] min-w-[24px]' : 'text-[15px] min-w-[30px]';
  const padCls = size === 'sm' ? 'px-3 py-1.5 gap-3' : 'px-4 py-2 gap-4';

  return (
    <div
      className={cn(
        'flex items-center border border-ink/8 bg-white',
        padCls,
        className,
      )}
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="p-1 text-ink/30 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={iconSize} />
      </button>
      <span className={cn('font-mono text-center tabular-nums', textCls)}>{value}</span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="p-1 text-ink/30 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
