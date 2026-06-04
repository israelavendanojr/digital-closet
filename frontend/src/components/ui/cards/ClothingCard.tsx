import { Icon } from '../icons'

interface ClothingCardProps {
  label: string
  imageUrl?: string
  tags?: string[]
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function ClothingCard({ label, imageUrl, onClick, onEdit, onDelete }: ClothingCardProps) {
  return (
    <div
      className="group bg-bg-soft border border-border-soft rounded-lg p-0 cursor-pointer text-left flex flex-col overflow-hidden transition-all duration-[180ms] hover:-translate-y-[3px] hover:shadow-md hover:border-line relative"
      role="button"
      aria-label={label}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
    >
      {/* Quick action buttons — revealed on hover */}
      <div className="absolute top-[14px] right-[14px] flex gap-[6px] z-10 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[180ms]">
        <button
          className="w-[34px] h-[34px] rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-all duration-150"
          style={{ background: 'rgba(251,248,241,.94)', color: 'var(--color-ink)' }}
          onClick={(e) => { e.stopPropagation(); onEdit?.() }}
          aria-label="Edit"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-clay)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,248,241,.94)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)' }}
        >
          {Icon.edit({ size: 15 })}
        </button>
        <button
          className="w-[34px] h-[34px] rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-all duration-150"
          style={{ background: 'rgba(251,248,241,.94)', color: 'var(--color-ink)' }}
          onClick={(e) => { e.stopPropagation(); onDelete?.() }}
          aria-label="Delete"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-clay)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,248,241,.94)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)' }}
        >
          {Icon.trash({ size: 15 })}
        </button>
      </div>

      {/* Image area */}
      <div className="w-full aspect-square bg-surface-2 flex items-center justify-center overflow-hidden">
        {imageUrl
          ? <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
          : <span className="text-[28px] text-muted">+</span>
        }
      </div>

      {/* Label */}
      <div className="px-[10px] pt-[11px] pb-[8px]">
        <p className="font-sans font-semibold text-[15px] text-ink whitespace-nowrap overflow-hidden text-ellipsis leading-tight">{label}</p>
      </div>
    </div>
  )
}
