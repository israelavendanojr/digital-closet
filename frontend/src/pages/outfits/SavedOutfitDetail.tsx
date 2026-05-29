import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Button from '../components/ui/Button'
import TagInput from '../components/ui/TagInput'
import { SlotView, cycle, MAIN_SLOTS, type MainSlot } from '../components/ui/OutfitBuilder'
import { getAllClothes, type ClothingItem } from '../services/clothingApi'
import { getOutfit, updateOutfit, deleteOutfit, type Outfit } from '../services/outfitApi'

const SUGGESTIONS = ['casual', 'formal', 'winter', 'summer', 'vintage', 'y2k', 'chic', 'work']

export default function SavedOutfitDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId, getToken } = useAuth()

  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const [clothingByCategory, setClothingByCategory] = useState<Record<string, ClothingItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Slot indices: -1 means no item selected
  const [slotIndex, setSlotIndex] = useState<Record<MainSlot, number>>({
    hatwear: -1, outerwear: -1, tops: -1, bottoms: -1, footwear: -1,
  })
  // Accessory slots: each is an index into clothingByCategory.accessories
  const [accessorySlots, setAccessorySlots] = useState<number[]>([])

  // Edit form state
  const [name, setName] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    if (!userId) return
    Promise.all([getOutfit(id, getToken), getAllClothes(userId, getToken)])
      .then(([fetchedOutfit, allItems]) => {
        setOutfit(fetchedOutfit)
        setName(fetchedOutfit.name)
        setTags(fetchedOutfit.tags)
        setIsFavorite(fetchedOutfit.isFavorite)

        // Group all user clothing by category
        const byCategory: Record<string, ClothingItem[]> = {}
        for (const item of allItems) {
          if (!byCategory[item.category]) byCategory[item.category] = []
          byCategory[item.category].push(item)
        }
        setClothingByCategory(byCategory)

        // Initialize slot indices from outfit's items
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
  }, [id])

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
    if (!id || !name.trim()) return
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
      await updateOutfit(id, { name, items: selectedIds, tags, isFavorite }, getToken)
      navigate('/outfits')
    } catch (err: any) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    setDeleting(true)
    try {
      await deleteOutfit(id, getToken)
      navigate('/outfits')
    } catch (err: any) {
      setSaveError(err.message)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) return <p className="px-6 py-8 text-text-muted">Loading...</p>
  if (fetchError) return <p className="px-6 py-8 text-red-500">{fetchError}</p>
  if (!outfit) return <p className="px-6 py-8 text-text-muted">Outfit not found.</p>

  const accessories = clothingByCategory['accessories'] ?? []

  return (
    <div className="px-6 py-8 max-w-240 mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          className="bg-transparent border-none text-sm text-text-muted cursor-pointer p-0 hover:text-text transition-colors duration-150"
          onClick={() => navigate('/outfits')}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-normal">Edit Outfit</h1>
      </div>

      <div className="grid grid-cols-2 gap-10 items-start max-sm:grid-cols-1">

        {/* Left: Visual outfit builder */}
        <div className="flex gap-4 items-start">
          {/* Main outfit stack */}
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

          {/* Accessories column */}
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
            <Button variant="ghost" onClick={() => navigate('/outfits')}>← Back</Button>
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
    </div>
  )
}
