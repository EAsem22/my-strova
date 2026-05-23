import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'text' | 'card' | 'circle'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  width?: string | number
  height?: string | number
  lines?: number
}

function SkeletonBase({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shimmer rounded', className)}
      style={style}
      aria-hidden="true"
      {...props}
    />
  )
}

export function Skeleton({ variant = 'text', width, height, lines = 1, className, ...props }: SkeletonProps) {
  if (variant === 'circle') {
    const size = width ?? height ?? 40
    return (
      <SkeletonBase
        className={cn('rounded-full shrink-0', className)}
        style={{ width: size, height: size }}
        {...props}
      />
    )
  }

  if (variant === 'card') {
    return (
      <SkeletonBase
        className={cn('rounded-xl', className)}
        style={{ width: width ?? '100%', height: height ?? 120 }}
        {...props}
      />
    )
  }

  // text — renders 1 or more lines
  if (lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBase
            key={i}
            className="h-4 rounded"
            style={{ width: i === lines - 1 ? '66%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  return (
    <SkeletonBase
      className={cn('h-4', className)}
      style={{ width: width ?? '100%', height: height }}
      {...props}
    />
  )
}
