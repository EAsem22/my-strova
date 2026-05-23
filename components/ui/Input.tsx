import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink-soft"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink placeholder:text-muted',
            'transition-all duration-150 outline-none',
            'focus:border-emerald focus:ring-2 focus:ring-emerald/20',
            error && 'border-red focus:border-red focus:ring-red/20',
            'disabled:pointer-events-none disabled:opacity-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
