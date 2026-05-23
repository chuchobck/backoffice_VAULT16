import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-electric-500 hover:bg-electric-600 active:bg-electric-700 text-white shadow-sm',
  secondary:
    'bg-asphalt-600 hover:bg-asphalt-500 text-asphalt-100 border border-asphalt-500',
  ghost:
    'text-asphalt-300 hover:bg-asphalt-700 hover:text-asphalt-100',
  danger:
    'bg-status-danger text-white hover:opacity-90',
  outline:
    'border border-electric-500 text-electric-400 hover:bg-electric-500/10',
}

const sizes: Record<ButtonSize, string> = {
  sm:   'h-8 px-3 text-xs gap-1.5 rounded-md',
  md:   'h-9 px-4 text-sm gap-2 rounded-md',
  lg:   'h-10 px-5 text-base gap-2 rounded-lg',
  icon: 'h-9 w-9 rounded-md',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, leftIcon, rightIcon, children, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  ),
)
Button.displayName = 'Button'
