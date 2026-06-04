export type Corner = 'nw' | 'ne' | 'sw' | 'se'

export interface CanvasItemData {
  instanceId: string
  clothingId: string
  imageUrl: string
  name: string
  x: number
  y: number
  zIndex: number
  width: number
}

interface CanvasItemProps {
  item: CanvasItemData
  isSelected: boolean
  onRemove: (instanceId: string) => void
  onPointerDown: (e: React.PointerEvent, instanceId: string) => void
  onResizeStart: (e: React.PointerEvent, instanceId: string, corner: Corner) => void
}

const HANDLES: { corner: Corner; style: React.CSSProperties; cursor: string }[] = [
  { corner: 'nw', style: { top: -5, left: -5 },     cursor: 'nw-resize' },
  { corner: 'ne', style: { top: -5, right: -5 },    cursor: 'ne-resize' },
  { corner: 'sw', style: { bottom: -5, left: -5 },  cursor: 'sw-resize' },
  { corner: 'se', style: { bottom: -5, right: -5 }, cursor: 'se-resize' },
]

export default function CanvasItem({ item, isSelected, onRemove, onPointerDown, onResizeStart }: CanvasItemProps) {
  return (
    <div
      data-instance={item.instanceId}
      className="absolute select-none cursor-grab active:cursor-grabbing"
      style={{ left: item.x, top: item.y, width: item.width, zIndex: item.zIndex }}
      onPointerDown={e => onPointerDown(e, item.instanceId)}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-auto block drop-shadow-md"
        draggable={false}
        style={{ pointerEvents: 'none' }}
      />

      {isSelected && (
        <>
          {/* Selection border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1, overflow: 'visible' }}
          >
            <rect width="100%" height="100%" fill="none" stroke="#2A3F6B" strokeWidth="1" strokeDasharray="6 10" strokeOpacity="0.45" rx="2" />
          </svg>

          {/* Remove button */}
          <button
            className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md border-none cursor-pointer transition-colors duration-150"
            style={{ background: 'var(--color-ink)', color: 'var(--color-bg)', zIndex: 3 }}
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onRemove(item.instanceId)}
            aria-label="Remove item"
          >
            ✕
          </button>

          {/* Corner handles */}
          {HANDLES.map(({ corner, style, cursor }) => (
            <div
              key={corner}
              className="absolute w-[10px] h-[10px]"
              style={{
                background: 'white',
                border: '1px solid rgba(42,63,107,0.5)',
                borderRadius: 1,
                cursor,
                zIndex: 2,
                ...style,
              }}
              onPointerDown={e => {
                e.stopPropagation()
                onResizeStart(e, item.instanceId, corner)
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
