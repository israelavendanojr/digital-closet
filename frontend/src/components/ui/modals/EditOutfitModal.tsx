import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Button from '../Button'
import TagInput from '../inputs/TagInput'
import { SlotView, cycle, MAIN_SLOTS, type MainSlot } from '../canvas/OutfitBuilder'
import { getAllClothes, type ClothingItem } from '../../../services/clothingApi'
import { getOutfit, updateOutfit, deleteOutfit, type Outfit } from '../../../services/outfitApi'

const SUGGESTIONS = ['casual', 'formal', 'winter', 'summer', 'vintage', 'y2k', 'chic', 'work']

interface EditOutfitModalProps {
  outfitId: string
  userId: string
  initialConfirmDelete?: boolean
  onClose: () => void
  onSaved: (outfit: Outfit) => void
  onDeleted: (id: string) => void
}

export default function EditOutfitModal({ outfitId, userId, initialConfirmDelete = false, onClose, onSaved, onDeleted }: EditOutfitModalProps) {
  const { getToken } = useAuth()

  const [clothingByCategory, setClothingByCategory] = useState<Record<string, ClothingItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [slotIndex, setSlotIndex] = useState<Record<MainSlot, number>>({
    hatwear: -1, outerwear: -1, tops: -1, bottoms: -1, footwear: -1,
  })
  const [accessorySlots, setAccessorySlots] = useState<number[]>([])

  const [name, setName] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(initialConfirmDelete)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 160)
  }

  useEffect(() => {
    Promise.all([getOutfit(outfitId, getToken), getAllClothes(userId, getToken)])
      .then(([fetchedOutfit, allItems]) => {
        setName(fetchedOutfit.name)
        setTags(fetchedOutfit.tags)
        setIsFavorite(fetchedOutfit.isFavorite)

        const byCategory: Record<string, ClothingItem[]> = {}
        for (const item of allItems) {
          if (!byCategory[item.category]) byCategory[item.category] = []
          byCategory[item.category].push(item)
        }
        setClothingByCategory(byCategory)

        const newSlotIndex: Record<MainSlot, number> = {
          hatwear: -1, outerwear: -1, tops: -1, bottoms: -1, footwear: -1,
        }
        const accSlots: number[] = []

        for (const outfitItem of fetchedOutfit.items) {
          const cat = outfitItem.category as string
          if (cat === 'accessories') {
            const idx = (byCategory.accessories ?? []).findIndex(i => i._id === outfitItem._id)
            if (idx !== -1) accSlots.push(idx)
          } else if (cat in newSlotIndex) {
            const idx = (byCategory[cat] ?? []).findIndex(i => i._id === outfitItem._id)
            newSlotIndex[cat as MainSlot] = idx
          }
        }

        setSlotIndex(newSlotIndex)
        setAccessorySlots(accSlots)
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false))
  }, [outfitId])

  function moveSlot(cat: MainSlot, dir: 1 | -1) {
    const items = clothingByCategory[cat] ?? []
    setSlotIndex(prev => ({ ...prev, [cat]: cycle(prev[cat], items.length, dir) }))
  }

  function moveAccessory(slotPos: number, dir: 1 | -1) {
    const items = clothingByCategory['accessories'] ?? []
    setAccessorySlots(prev => {
      const next = [...prev]
      next[slotPos] = cycle(next[slotPos], items.length, dir)
      return next
    })
  }

  function addAccessorySlot() {
    const items = clothingByCategory['accessories'] ?? []
    setAccessorySlots(prev => [...prev, items.length > 0 ? 0 : -1])
  }

  function removeAccessorySlot(slotPos: number) {
    setAccessorySlots(prev => prev.filter((_, i) => i !== slotPos))
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      const selectedIds: string[] = []
      for (const { key } of MAIN_SLOTS) {
        const idx = slotIndex[key]
        if (idx !== -1) {
          const item = (clothingByCategory[key] ?? [])[idx]
          if (item) selectedIds.push(item._id)
        }
      }
      const accessories = clothingByCategory['accessories'] ?? []
      for (const idx of accessorySlots) {
        if (idx !== -1 && accessories[idx]) selectedIds.push(accessories[idx]._id)
      }
      const updated = await updateOutfit(outfitId, { name, items: selectedIds, tags, isFavorite }, getToken)
      onSaved(updated)
      handleClose()
    } catch (err: any) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteOutfit(outfitId, getToken)
      onDeleted(outfitId)
      handleClose()
    } catch (err: any) {
      setSaveError(err.message)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const accessories = clothingByCategory['accessories'] ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/30 ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
        onClick={handleClose}
      />
      <div className={`relative bg-card rounded-xl shadow-xl overflow-y-auto max-h-[90vh] w-[min(92vw,900px)] flex flex-col ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <h2 className="text-xl font-normal">Edit Outfit</h2>
          <button
            className="bg-transparent border-none text-text-muted hover:text-text cursor-pointer text-lg p-0 leading-none"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          {loading && <p className="text-text-muted">Loading...</p>}
          {fetchError && <p className="text-red-500">{fetchError}</p>}
          {!loading && !fetchError && (
            <div className="grid grid-cols-2 gap-10 items-start max-sm:grid-cols-1">
              {/* Left: Visual outfit builder */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col gap-2">
                  {MAIN_SLOTS.map(({ key, label }) => {
                    const items = clothingByCategory[key] ?? []
                    const idx = slotIndex[key]
                    const current = idx !== -1 ? items[idx] ?? null : null
                    return (
                      <SlotView
                        key={key}
                        label={label}
                        item={current}
                        onPrev={() => moveSlot(key, -1)}
                        onNext={() => moveSlot(key, 1)}
                        disabled={items.length === 0}
                      />
                    )
                  })}
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-xs text-text-muted font-medium ml-8">Accessories</span>
                  {accessorySlots.map((idx, slotPos) => {
                    const current = idx !== -1 ? accessories[idx] ?? null : null
                    return (
                      <div key={slotPos} className="flex items-center gap-1">
                        <SlotView
                          label="Acc"
                          item={current}
                          onPrev={() => moveAccessory(slotPos, -1)}
                          onNext={() => moveAccessory(slotPos, 1)}
                          disabled={accessories.length === 0}
                        />
                        <button
                          onClick={() => removeAccessorySlot(slotPos)}
                          className="text-text-muted hover:text-text text-xs bg-transparent border-none cursor-pointer p-0 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                  <button
                    onClick={addAccessorySlot}
                    className="ml-8 text-xs text-text-muted hover:text-text bg-transparent border-none cursor-pointer p-0 text-left"
                  >
                    + Add accessory
                  </button>
                </div>
              </div>

              {/* Right: Edit form */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-muted">Name:</label>
                  <input
                    className="borderless-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Weekend Casual"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-muted">Tags:</label>
                  <TagInput tags={tags} onChange={setTags} suggestions={SUGGESTIONS} />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={e => setIsFavorite(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-text-muted">Mark as favorite</span>
                </label>

                {saveError && <p className="text-red-500 text-sm">{saveError}</p>}

                <div className="flex gap-3 justify-end mt-2">
                  <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                  <Button disabled={saving || !name.trim()} onClick={handleSave}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>

                <div className="border-t border-border pt-4 mt-2">
                  {!confirmDelete ? (
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
                      Delete Outfit
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-text-muted">Are you sure? This cannot be undone.</p>
                      <div className="flex gap-3">
                        <Button size="sm" disabled={deleting} onClick={handleDelete}>
                          {deleting ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
