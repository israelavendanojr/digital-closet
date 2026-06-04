interface OutfitCardProps {
  name: string
  items?: { label: string; imageUrl?: string }[]
  onClick?: () => void
}

export default function OutfitCard({ name, items = [], onClick }: OutfitCardProps) {
  const displayItems = items.slice(0, 4)
  const empties = Array(Math.max(0, 4 - displayItems.length)).fill(null)

  return (
    <button
      className="bg-bg-soft border border-border-soft rounded-lg p-3 cursor-pointer text-left flex flex-col gap-2.5 transition-all duration-[180ms] hover:-translate-y-[3px] hover:shadow-md hover:border-line"
      onClick={onClick}
    >
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
