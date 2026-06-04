import { cn } from '../../../lib/cn'

interface TagChipProps {
  label: string
  onRemove?: () => void
  active?: boolean
  onClick?: () => void
}

export default function TagChip({ label, onRemove, active, onClick }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-sans font-semibold text-[13px] px-[13px] py-[6px] rounded-pill border transition-all duration-150 whitespace-nowrap',
        onClick ? 'cursor-pointer' : '',
        active
          ? 'bg-clay border-clay text-white'
          : 'bg-bg-soft border-border text-ink-soft hover:border-clay hover:text-clay',
      )}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <button
          className={cn(
            'bg-transparent border-none p-0 text-base leading-none cursor-pointer flex items-center transition-colors duration-150',
            active ? 'text-white/70 hover:text-white' : 'text-faint hover:text-ink-soft',
          )}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
