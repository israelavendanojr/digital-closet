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
      className="bg-bg-card border border-border rounded p-3 cursor-pointer text-left flex flex-col gap-2.5 transition-shadow duration-150 hover:shadow"
      onClick={onClick}
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5 aspect-square">
        {displayItems.map((item, i) => (
          <div key={i} className="bg-border rounded-sm flex items-center justify-center overflow-hidden">
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.label} className="w-full h-full object-cover" />
              : <span className="text-lg font-medium text-text-muted uppercase">{item.label[0]}</span>
            }
          </div>
        ))}
        {empties.map((_, i) => (
          <div key={`empty-${i}`} className="bg-border rounded-sm flex items-center justify-center overflow-hidden">
            <span className="text-xl text-text-light">+</span>
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-text whitespace-nowrap overflow-hidden text-ellipsis">{name}</p>
    </button>
  )
}
