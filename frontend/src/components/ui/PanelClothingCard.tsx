import type { ClothingItem } from '../../services/clothingApi'

interface PanelClothingCardProps {
  item: ClothingItem
  onClick: () => void
}

export default function PanelClothingCard({ item, onClick }: PanelClothingCardProps) {
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('clothingId', item._id)
    e.dataTransfer.setData('imageUrl', item.imageUrl)
    e.dataTransfer.setData('name', item.name)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className="group bg-surface border border-border-soft rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-[180ms] hover:-translate-y-[2px] hover:shadow-md hover:border-line select-none"
    >
      <div className="w-full aspect-[3/4] bg-surface-2 flex items-center justify-center overflow-hidden">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" draggable={false} />
          : <span className="text-[20px] text-muted">+</span>
        }
      </div>
      <div className="px-[6px] pt-[5px] pb-[6px]">
        <p className="font-sans text-[11px] font-semibold text-ink whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
          {item.name}
        </p>
      </div>
    </div>
  )
}
