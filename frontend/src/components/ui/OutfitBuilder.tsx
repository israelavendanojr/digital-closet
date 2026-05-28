export type MainSlot = 'hatwear' | 'outerwear' | 'tops' | 'bottoms' | 'footwear'

export const MAIN_SLOTS: { key: MainSlot; label: string }[] = [
  { key: 'hatwear', label: 'Hat' },
  { key: 'outerwear', label: 'Outer' },
  { key: 'tops', label: 'Top' },
  { key: 'bottoms', label: 'Bottom' },
  { key: 'footwear', label: 'Footwear' },
]

// Cycles through: none(-1) → 0 → 1 → ... → length-1 → none(-1) → ...
export function cycle(index: number, length: number, dir: 1 | -1): number {
  if (length === 0) return -1
  const pos = index === -1 ? length : index
  const newPos = (pos + dir + length + 1) % (length + 1)
  return newPos === length ? -1 : newPos
}

export interface SlotItem {
  _id?: string
  name: string
  imageUrl: string
}

interface SlotViewProps {
  label: string
  item: SlotItem | null
  onPrev: () => void
  onNext: () => void
  disabled: boolean
}

export function SlotView({ label, item, onPrev, onNext, disabled }: SlotViewProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onPrev}
        disabled={disabled}
        className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none text-base"
      >
        ‹
      </button>
      <div className="flex flex-col items-center gap-1 w-28">
        {item ? (
          <>
            <div className="w-28 h-28 rounded overflow-hidden border border-border bg-bg-card">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-text-muted text-center leading-tight truncate w-full">{item.name}</span>
          </>
        ) : (
          <div className="w-28 h-28 rounded border-2 border-dashed border-border bg-bg-card flex items-center justify-center">
            <span className="text-xs text-text-muted">{label}</span>
          </div>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={disabled}
        className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none text-base"
      >
        ›
      </button>
    </div>
  )
}
