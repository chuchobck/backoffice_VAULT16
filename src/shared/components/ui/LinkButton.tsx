import { type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  className?: string
  children?: ReactNode
  'aria-label'?: string
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-electric-500 hover:bg-electric-600 text-white shadow-sm',
  secondary: 'bg-asphalt-600 hover:bg-asphalt-500 text-asphalt-100 border border-asphalt-500',
  ghost: 'text-asphalt-300 hover:bg-asphalt-700 hover:text-asphalt-100',
  danger: 'bg-status-danger text-white hover:opacity-90',
  outline: 'border border-electric-500 text-electric-400 hover:bg-electric-500/10',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-md',
  lg: 'h-10 px-5 text-base gap-2 rounded-lg',
  icon: 'h-9 w-9 rounded-md',
}

export function LinkButton({ variant = 'ghost', size = 'md', leftIcon, className, children, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
    </Link>
  )
}
