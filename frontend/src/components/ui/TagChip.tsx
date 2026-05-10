interface TagChipProps {
  label: string
  onRemove?: () => void
}

export default function TagChip({ label, onRemove }: TagChipProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-border text-text text-[13px] px-2.5 py-1 rounded-pill">
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
