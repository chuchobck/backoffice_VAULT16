import { type ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-asphalt-600 text-asphalt-100 border-asphalt-500',
  success: 'bg-green-900/40 text-green-400 border-green-500/30',
  warning: 'bg-amber-900/40 text-amber-400 border-amber-500/30',
  danger:  'bg-red-900/40 text-red-400 border-red-500/30',
  info:    'bg-electric-900/40 text-electric-400 border-electric-500/30',
  muted:   'bg-asphalt-700 text-asphalt-400 border-asphalt-600',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
