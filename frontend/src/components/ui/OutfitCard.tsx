interface OutfitCardProps {
  name: string
  items?: { label: string; imageUrl?: string }[]
  onClick?: () => void
  onEdit?: () => void
}

export default function OutfitCard({ name, items = [], onClick, onEdit }: OutfitCardProps) {
  const displayItems = items.slice(0, 4)
  const empties = Array(Math.max(0, 4 - displayItems.length)).fill(null)

  return (
    <button
      className="group bg-bg-soft border border-border-soft rounded-lg p-3 cursor-pointer text-left flex flex-col gap-2.5 transition-all duration-[180ms] hover:-translate-y-[3px] hover:shadow-md hover:border-line relative"
      onClick={onClick}
    >
      <div className="absolute top-3 right-3 z-10 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[180ms]">
        <button
          className="w-[34px] h-[34px] rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-all duration-150 text-sm"
          style={{ background: 'rgba(251,248,241,.94)', color: 'var(--color-ink)' }}
          onClick={(e) => { e.stopPropagation(); onEdit?.() }}
          aria-label="Edit outfit"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-clay)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,248,241,.94)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)' }}
        >
          ✎
        </button>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5 aspect-square">
        {displayItems.map((item, i) => (
          <div key={i} className="bg-surface border border-border-soft rounded-md flex items-center justify-center overflow-hidden">
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.label} className="w-full h-full object-cover" />
              : <span className="text-lg font-semibold text-muted uppercase">{item.label[0]}</span>
            }
          </div>
        ))}
        {empties.map((_, i) => (
          <div key={`empty-${i}`} className="bg-surface border border-border-soft rounded-md flex items-center justify-center overflow-hidden">
            <span className="text-xl text-faint">+</span>
          </div>
        ))}
      </div>
      <p className="font-sans font-semibold text-[15px] text-ink whitespace-nowrap overflow-hidden text-ellipsis">{name}</p>
    </button>
  )
}
