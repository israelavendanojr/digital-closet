import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  primary:   'bg-clay text-white border border-clay hover:enabled:bg-clay-deep hover:enabled:border-clay-deep hover:enabled:shadow-[0_6px_16px_rgba(190,111,74,.28)]',
  secondary: 'bg-ink text-white border border-ink hover:enabled:opacity-85',
  ghost:     'bg-bg-soft text-ink border border-border hover:enabled:shadow-sm hover:enabled:border-line',
}

const sizeClasses = {
  sm: 'text-[14px] px-[15px] py-[9px]',
  md: 'text-[15px] px-[20px] py-[12px]',
  lg: 'text-base px-[26px] py-[14px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-sans font-semibold cursor-pointer transition-all duration-150 whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
