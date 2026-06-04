import type { HTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const padClasses = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
}

export default function Card({
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn('bg-bg-soft border border-border-soft rounded-lg shadow-sm', padClasses[padding], className)} {...props}>
      {children}
    </div>
  )
}
