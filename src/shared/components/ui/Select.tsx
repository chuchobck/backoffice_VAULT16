import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-asphalt-200">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-md border px-3 py-2 text-sm transition-colors',
            'bg-asphalt-800 border-asphalt-600 text-asphalt-100',
            'focus:outline-none focus:ring-2 focus:ring-electric-500 focus:border-electric-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-status-danger',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-status-danger" role="alert">{error}</p>
        )}
      </div>
    )
  },
)
Select.displayName = 'Select'
