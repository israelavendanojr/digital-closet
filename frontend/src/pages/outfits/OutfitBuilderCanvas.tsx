import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Button from '../../components/ui/Button'
import PanelClothingCard from '../../components/ui/canvas/PanelClothingCard'
import CanvasItem, { type CanvasItemData, type Corner } from '../../components/ui/canvas/CanvasItem'
import TagInput from '../../components/ui/inputs/TagInput'
import { getAllClothes, toBackendCategory, type ClothingItem } from '../../services/clothingApi'
import { createOutfit, getOutfit, updateOutfit, deleteOutfit } from '../../services/outfitApi'
import type { Category } from '../../components/ui/CategoryTabs'

const SUGGESTIONS = ['casual', 'formal', 'winter', 'summer', 'vintage', 'y2k', 'chic', 'work']

const CATEGORIES: Category[] = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories']

interface DragState {
  instanceId: string
  startX: number
  startY: number
  itemX: number
  itemY: number
}

interface ResizeState {
  instanceId: string
  corner: Corner
  startX: number
  startY: number
  x0: number
  y0: number
  w0: number
  h0: number
}

interface RotateState {
  instanceId: string
  centerX: number
  centerY: number
  startAngle: number
  startRotation: number
}

function computeResize(
  corner: Corner, dx: number, _dy: number,
  x0: number, y0: number, w0: number, h0: number, minW = 40
): { newW: number; newX: number; newY: number } {
  if (corner === 'se') {
    const newW = Math.max(minW, w0 + dx)
    return { newW, newX: x0, newY: y0 }
  }
  if (corner === 'sw') {
    const newW = Math.max(minW, w0 - dx)
    return { newW, newX: x0 + w0 - newW, newY: y0 }
  }
  if (corner === 'ne') {
    const newW = Math.max(minW, w0 + dx)
    const s = newW / w0
    return { newW, newX: x0, newY: y0 + h0 - h0 * s }
  }
  // nw
  const newW = Math.max(minW, w0 - dx)
  const s = newW / w0
  return { newW, newX: x0 + w0 - newW, newY: y0 + h0 - h0 * s }
}

export default function OutfitBuilderCanvas() {
  const navigate = useNavigate()
  const { id: editId } = useParams<{ id?: string }>()
  const isEditMode = Boolean(editId)
  const { userId, getToken } = useAuth()

  const [allClothes, setAllClothes] = useState<ClothingItem[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [loadingClothes, setLoadingClothes] = useState(true)

  const [canvasItems, setCanvasItems] = useState<CanvasItemData[]>([])
  const [maxZ, setMaxZ] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [outfitName, setOutfitName] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<DragState | null>(null)
  const resizingRef = useRef<ResizeState | null>(null)
  const rotatingRef = useRef<RotateState | null>(null)

  useEffect(() => {
    if (!userId) return
    getAllClothes(userId, getToken)
      .then(setAllClothes)
      .finally(() => setLoadingClothes(false))
  }, [userId])

  // In edit mode, load existing outfit and pre-populate canvas
  useEffect(() => {
    if (!editId || !userId) return
    getOutfit(editId, getToken).then(outfit => {
      setOutfitName(outfit.name)
      setTags(outfit.tags)
      setIsFavorite(outfit.isFavorite)

      let items: CanvasItemData[]
      let z = 1

      if (outfit.canvasLayout && outfit.canvasLayout.length > 0) {
        // Restore saved canvas layout
        const itemMap = new Map(outfit.items.map(item => [item._id, item]))
        items = outfit.canvasLayout.map((entry, i) => {
          const clothing = itemMap.get(entry.clothingId)
          z = Math.max(z, entry.zIndex + 1)
          return {
            instanceId: `${entry.clothingId}-${i}`,
            clothingId: entry.clothingId,
            imageUrl: clothing?.imageUrl ?? '',
            name: clothing?.name ?? '',
            x: entry.x,
            y: entry.y,
            width: entry.width,
            zIndex: entry.zIndex,
            rotation: entry.rotation ?? 0,
          }
        })
      } else {
        // Fallback: default grid for outfits saved before layout persistence
        items = outfit.items.map((item, i) => {
          z = i + 2
          return {
            instanceId: `${item._id}-${i}`,
            clothingId: item._id,
            imageUrl: item.imageUrl,
            name: item.name,
            x: 40 + (i % 4) * 160,
            y: 40 + Math.floor(i / 4) * 180,
            zIndex: i + 1,
            width: 140,
            rotation: 0,
          }
        })
      }

      setMaxZ(z)
      setCanvasItems(items)
    })
  }, [editId, userId])

  const filteredClothes = activeCategory === 'All'
    ? allClothes
    : allClothes.filter(item => item.category === toBackendCategory(activeCategory))

  function addToCanvas(clothingId: string, imageUrl: string, name: string, x?: number, y?: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const cx = x ?? (rect.width / 2 - 60 + (Math.random() - 0.5) * 80)
    const cy = y ?? (rect.height / 2 - 60 + (Math.random() - 0.5) * 80)
    const newZ = maxZ + 1
    setMaxZ(newZ)
    setCanvasItems(prev => [...prev, {
      instanceId: `${Date.now()}-${Math.random()}`,
      clothingId,
      imageUrl,
      name,
      x: Math.max(0, Math.round(cx)),
      y: Math.max(0, Math.round(cy)),
      zIndex: newZ,
      width: 140,
      rotation: 0,
    }])
  }

  function handleCanvasDrop(e: React.DragEvent) {
    e.preventDefault()
    const clothingId = e.dataTransfer.getData('clothingId')
    const imageUrl = e.dataTransfer.getData('imageUrl')
    const name = e.dataTransfer.getData('name')
    if (!clothingId) return
    const rect = canvasRef.current!.getBoundingClientRect()
    addToCanvas(clothingId, imageUrl, name, e.clientX - rect.left - 70, e.clientY - rect.top - 70)
  }

  function handleItemPointerDown(e: React.PointerEvent, instanceId: string) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setSelectedId(instanceId)
    const item = canvasItems.find(i => i.instanceId === instanceId)
    if (!item) return
    draggingRef.current = {
      instanceId,
      startX: e.clientX,
      startY: e.clientY,
      itemX: item.x,
      itemY: item.y,
    }
    const newZ = maxZ + 1
    setMaxZ(newZ)
    setCanvasItems(prev => prev.map(i =>
      i.instanceId === instanceId ? { ...i, zIndex: newZ } : i
    ))
  }

  function handleResizePointerDown(e: React.PointerEvent, instanceId: string, corner: Corner) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    const item = canvasItems.find(i => i.instanceId === instanceId)
    if (!item) return
    const el = canvasRef.current?.querySelector(`[data-instance="${instanceId}"]`) as HTMLElement | null
    const h0 = el?.getBoundingClientRect().height ?? item.width
    resizingRef.current = {
      instanceId, corner,
      startX: e.clientX, startY: e.clientY,
      x0: item.x, y0: item.y, w0: item.width, h0,
    }
    setSelectedId(instanceId)
  }

  function handleCanvasPointerMove(e: React.PointerEvent) {
    // Rotate path
    const rotate = rotatingRef.current
    if (rotate) {
      const canvasRect = canvasRef.current!.getBoundingClientRect()
      const angle = Math.atan2(
        e.clientY - canvasRect.top - rotate.centerY,
        e.clientX - canvasRect.left - rotate.centerX
      ) * (180 / Math.PI)
      const newRotation = rotate.startRotation + (angle - rotate.startAngle)
      const el = canvasRef.current?.querySelector(`[data-instance="${rotate.instanceId}"]`) as HTMLElement | null
      if (el) el.style.transform = `rotate(${newRotation}deg)`
      return
    }

    // Resize path
    const resize = resizingRef.current
    if (resize) {
      const { newW, newX, newY } = computeResize(
        resize.corner,
        e.clientX - resize.startX, e.clientY - resize.startY,
        resize.x0, resize.y0, resize.w0, resize.h0
      )
      const el = canvasRef.current?.querySelector(`[data-instance="${resize.instanceId}"]`) as HTMLElement | null
      if (el) {
        el.style.width = `${newW}px`
        el.style.left = `${newX}px`
        el.style.top = `${newY}px`
      }
      return
    }

    // Drag path
    const drag = draggingRef.current
    if (!drag) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const el = canvasRef.current?.querySelector(`[data-instance="${drag.instanceId}"]`) as HTMLElement | null
    if (el) {
      el.style.left = `${drag.itemX + dx}px`
      el.style.top = `${drag.itemY + dy}px`
    }
  }

  function handleCanvasPointerUp(e: React.PointerEvent) {
    // Rotate commit
    const rotate = rotatingRef.current
    if (rotate) {
      const canvasRect = canvasRef.current!.getBoundingClientRect()
      const angle = Math.atan2(
        e.clientY - canvasRect.top - rotate.centerY,
        e.clientX - canvasRect.left - rotate.centerX
      ) * (180 / Math.PI)
      const newRotation = rotate.startRotation + (angle - rotate.startAngle)
      setCanvasItems(prev => prev.map(i =>
        i.instanceId === rotate.instanceId ? { ...i, rotation: newRotation } : i
      ))
      rotatingRef.current = null
      return
    }

    // Resize commit
    const resize = resizingRef.current
    if (resize) {
      const canvas = canvasRef.current
      const canvasW = canvas?.offsetWidth ?? 9999
      const canvasH = canvas?.offsetHeight ?? 9999
      let { newW, newX, newY } = computeResize(
        resize.corner,
        e.clientX - resize.startX, e.clientY - resize.startY,
        resize.x0, resize.y0, resize.w0, resize.h0
      )
      newW = Math.min(newW, canvasW)
      newX = Math.max(0, Math.min(canvasW - newW, newX))
      newY = Math.max(0, Math.min(canvasH - 40, newY))
      setCanvasItems(prev => prev.map(i =>
        i.instanceId === resize.instanceId ? { ...i, width: newW, x: newX, y: newY } : i
      ))
      resizingRef.current = null
      return
    }

    // Drag commit
    const drag = draggingRef.current
    if (!drag) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const canvas = canvasRef.current
    const canvasW = canvas?.offsetWidth ?? 9999
    const canvasH = canvas?.offsetHeight ?? 9999
    setCanvasItems(prev => prev.map(i =>
      i.instanceId === drag.instanceId
        ? {
            ...i,
            x: Math.max(0, Math.min(canvasW - i.width, drag.itemX + dx)),
            y: Math.max(0, Math.min(canvasH - 40, drag.itemY + dy)),
          }
        : i
    ))
    draggingRef.current = null
  }

  function handleRotatePointerDown(e: React.PointerEvent, instanceId: string) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    const item = canvasItems.find(i => i.instanceId === instanceId)
    if (!item) return
    const el = canvasRef.current?.querySelector(`[data-instance="${instanceId}"]`) as HTMLElement | null
    const elH = el?.getBoundingClientRect().height ?? item.width
    const canvasRect = canvasRef.current!.getBoundingClientRect()
    const centerX = item.x + item.width / 2
    const centerY = item.y + elH / 2
    const startAngle = Math.atan2(
      e.clientY - canvasRect.top - centerY,
      e.clientX - canvasRect.left - centerX
    ) * (180 / Math.PI)
    rotatingRef.current = { instanceId, centerX, centerY, startAngle, startRotation: item.rotation }
    setSelectedId(instanceId)
  }

  function handleRemoveItem(instanceId: string) {
    setCanvasItems(prev => prev.filter(i => i.instanceId !== instanceId))
    setSelectedId(prev => prev === instanceId ? null : prev)
  }

  async function handleSave() {
    setSaveError(null)
    if (!outfitName.trim()) { setSaveError('Give your outfit a name first.'); return }
    if (canvasItems.length === 0) { setSaveError('Add at least one item to the canvas.'); return }
    setSaving(true)
    try {
      const itemIds = [...new Set(canvasItems.map(i => i.clothingId))]
      const canvasLayout = canvasItems.map(i => ({
        clothingId: i.clothingId,
        x: i.x,
        y: i.y,
        width: i.width,
        zIndex: i.zIndex,
        rotation: i.rotation,
      }))
      if (isEditMode && editId) {
        await updateOutfit(editId, { name: outfitName.trim(), items: itemIds, tags, isFavorite, canvasLayout }, getToken)
      } else {
        await createOutfit({ userId: userId!, name: outfitName.trim(), items: itemIds, tags, isFavorite, canvasLayout }, getToken)
      }
      navigate('/outfits')
    } catch (err: any) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!editId) return
    setDeleting(true)
    try {
      await deleteOutfit(editId, getToken)
      navigate('/outfits')
    } catch (err: any) {
      setSaveError(err.message)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="h-svh flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-header)' }}
      >
        <button
          onClick={() => navigate('/outfits')}
          className="flex items-center gap-1.5 font-sans font-semibold text-[14px] cursor-pointer border-none rounded-pill px-3 py-2 transition-colors duration-150 shrink-0"
          style={{ color: 'var(--color-ink-soft)', background: 'transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(63,58,49,.07)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-ink)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--color-ink-soft)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>

        <input
          type="text"
          value={outfitName}
          onChange={e => { setOutfitName(e.target.value); setSaveError(null) }}
          placeholder="Name your outfit..."
          className="borderless-input text-[20px] font-semibold shrink-0"
          style={{ width: 260 }}
        />

        {/* Tags inline */}
        <div className="flex-1 min-w-0">
          <TagInput tags={tags} onChange={setTags} suggestions={SUGGESTIONS} placeholder="Add tags..." />
        </div>

        {/* Favorite toggle */}
        <button
          onClick={() => setIsFavorite(f => !f)}
          className="border-none bg-transparent cursor-pointer p-1 leading-none flex items-center gap-1.5 shrink-0"
          aria-label="Toggle favorite"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'var(--color-clay)' : 'none'} stroke={isFavorite ? 'var(--color-clay)' : 'var(--color-ink-soft)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span className="font-sans text-[13px]" style={{ color: isFavorite ? 'var(--color-clay)' : 'var(--color-ink-soft)' }}>Favorite</span>
        </button>

        <div className="flex items-center gap-3 shrink-0">
          {saveError && (
            <span className="text-[13px] font-sans" style={{ color: 'var(--color-clay)' }}>{saveError}</span>
          )}
          {isEditMode && !confirmDelete && (
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
          {isEditMode && confirmDelete && (
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-sans" style={{ color: 'var(--color-ink-soft)' }}>Delete outfit?</span>
              <Button size="sm" disabled={deleting} onClick={handleDelete}>
                {deleting ? 'Deleting...' : 'Confirm'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            </div>
          )}
          <Button onClick={handleSave} disabled={saving} size="md">
            {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save Outfit'}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* Left panel */}
        <div
          className="w-[210px] shrink-0 flex flex-col"
          style={{ borderRight: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          {/* Category tabs */}
          <div
            className="p-2 flex flex-col gap-[2px] shrink-0"
            style={{ borderBottom: '1px solid var(--color-border-soft)' }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="font-sans font-semibold text-[13px] px-3 py-[7px] rounded-lg border-none cursor-pointer text-left transition-colors duration-150 whitespace-nowrap"
                style={{
                  background: activeCategory === cat ? 'var(--color-clay-tint)' : 'transparent',
                  color: activeCategory === cat ? 'var(--color-clay-deep)' : 'var(--color-ink-soft)',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(63,58,49,.05)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--color-ink)'
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--color-ink-soft)'
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable clothing grid */}
          <div className="flex-1 overflow-y-auto p-2">
            {loadingClothes ? (
              <p className="text-[12px] text-center py-6" style={{ color: 'var(--color-muted)' }}>Loading...</p>
            ) : filteredClothes.length === 0 ? (
              <p className="text-[12px] text-center py-6" style={{ color: 'var(--color-muted)' }}>No items yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredClothes.map(item => (
                  <PanelClothingCard
                    key={item._id}
                    item={item}
                    onClick={() => addToCanvas(item._id, item.imageUrl, item.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{ background: 'radial-gradient(120% 80% at 60% 40%, var(--color-surface) 0%, var(--color-bg) 70%)' }}
          onDragOver={e => e.preventDefault()}
          onDrop={handleCanvasDrop}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onClick={e => { if (e.target === e.currentTarget) setSelectedId(null) }}
        >
          {canvasItems.map(item => (
            <CanvasItem
              key={item.instanceId}
              item={item}
              isSelected={selectedId === item.instanceId}
              onRemove={handleRemoveItem}
              onPointerDown={handleItemPointerDown}
              onResizeStart={handleResizePointerDown}
              onRotateStart={handleRotatePointerDown}
            />
          ))}

          {canvasItems.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-faint)' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              <p className="font-sans text-[14px] text-center leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Click items from the panel<br/>or drag them here
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
