import Image from 'next/image';
import { cn } from '@/lib/utils';

type EntixLogoVariant = 'wordmark' | 'wordmarkWhite' | 'fullLockup' | 'mark';

const LOGOS: Record<EntixLogoVariant, { src: string; width: number; height: number }> = {
  wordmark: {
    src: '/brand/entix-wordmark.svg',
    width: 722,
    height: 251,
  },
  wordmarkWhite: {
    src: '/brand/entix-wordmark-white.svg',
    width: 722,
    height: 251,
  },
  fullLockup: {
    src: '/brand/entix-full-lockup.svg',
    width: 580,
    height: 510,
  },
  mark: {
    src: '/brand/entix-mark.svg',
    width: 820,
    height: 860,
  },
};

export function EntixLogo({
  variant = 'wordmark',
  className,
  priority = false,
}: {
  variant?: EntixLogoVariant;
  className?: string;
  priority?: boolean;
}) {
  const logo = LOGOS[variant];

  return (
    <Image
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt="Entix Jewellery"
      priority={priority}
      className={cn('h-auto w-full object-contain', className)}
    />
  );
}
