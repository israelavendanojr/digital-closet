interface TagChipProps {
  label: string
  onRemove?: () => void
  active?: boolean
  onClick?: () => void
}

export default function TagChip({ label, onRemove, active, onClick }: TagChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 border text-[13px] px-2.5 py-1 rounded-pill transition-colors duration-150 ${onClick ? 'cursor-pointer' : ''} ${active ? 'bg-text text-bg border-text' : 'bg-transparent border-border text-text-muted'}`}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <button
          className="bg-transparent border-none p-0 text-base leading-none text-text-muted cursor-pointer flex items-center hover:text-text"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
