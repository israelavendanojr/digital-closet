import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { SlotView, cycle, MAIN_SLOTS, type MainSlot } from '../components/ui/OutfitBuilder'
import { getAllClothes, TEST_USER_ID, type ClothingItem } from '../services/clothingApi'
import { createOutfit } from '../services/outfitApi'

export default function SavedOutfitCreation() {
  const navigate = useNavigate()
  const [clothingByCategory, setClothingByCategory] = useState<Record<string, ClothingItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [slotIndex, setSlotIndex] = useState<Record<MainSlot, number>>({
    hatwear: -1, outerwear: -1, tops: -1, bottoms: -1, footwear: -1,
  })
  const [accessorySlots, setAccessorySlots] = useState<number[]>([])
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllClothes(TEST_USER_ID)
      .then(allItems => {
        const byCategory: Record<string, ClothingItem[]> = {}
        for (const item of allItems) {
          if (!byCategory[item.category]) byCategory[item.category] = []
          byCategory[item.category].push(item)
        }
        setClothingByCategory(byCategory)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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
    setAccessorySlots(prev => [...prev, -1])
  }

  function removeAccessorySlot(slotPos: number) {
    setAccessorySlots(prev => prev.filter((_, i) => i !== slotPos))
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setError(null)
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
      const outfit = await createOutfit({ userId: TEST_USER_ID, name, items: selectedIds })
      navigate(`/outfits/${outfit._id}`)
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

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
        <h1 className="text-2xl font-normal">Create Outfit</h1>
      </div>

      {loading ? (
        <p className="text-text-muted text-sm">Loading your wardrobe...</p>
      ) : (
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

          {/* Right: Name + actions */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-muted">Name:</label>
              <input
                className="borderless-input"
                placeholder="e.g. Weekend Casual"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 justify-end mt-2">
              <Button variant="ghost" onClick={() => navigate('/outfits')}>Cancel</Button>
              <Button disabled={!name.trim() || saving} onClick={handleSave}>
                {saving ? 'Saving...' : 'Save & Quit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
