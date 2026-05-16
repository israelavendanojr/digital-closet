import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  primary:   'bg-bg-card text-text border border-border hover:enabled:bg-border',
  secondary: 'bg-text text-bg border-none hover:enabled:opacity-85',
  ghost:     'bg-transparent text-text-muted border border-border hover:enabled:bg-bg-card hover:enabled:text-text',
}

const sizeClasses = {
  sm: 'text-[13px] px-[14px] py-[6px]',
  md: 'text-[15px] px-[22px] py-[10px]',
  lg: 'text-base px-8 py-[14px]',
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
        'inline-flex items-center justify-center gap-2 rounded-pill font-medium cursor-pointer transition-[opacity,background] duration-150 whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed',
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
