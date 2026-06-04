import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import OutfitCard from '../../components/ui/OutfitCard'
import TagChip from '../../components/ui/TagChip'
import Button from '../../components/ui/Button'
import EditOutfitModal from '../../components/ui/EditOutfitModal'
import CreateOutfitModal from '../../components/ui/CreateOutfitModal'
import { getAllOutfits, type Outfit } from '../../services/outfitApi'

export default function SavedOutfits() {
  const { userId, getToken } = useAuth()
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingOutfitId, setEditingOutfitId] = useState<string | null>(null)
  const [creatingOutfit, setCreatingOutfit] = useState(false)

  useEffect(() => {
    if (!userId) return
    getAllOutfits(userId, getToken)
      .then(setOutfits)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  const availableTags = [...new Set(outfits.flatMap(o => o.tags))].sort()

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const visibleOutfits = selectedTags.length === 0
    ? outfits
    : outfits.filter(o => selectedTags.some(t => o.tags.includes(t)))

  function handleOutfitSaved(updated: Outfit) {
    setOutfits(prev => prev.map(o => o._id === updated._id ? updated : o))
  }

  function handleOutfitDeleted(id: string) {
    setOutfits(prev => prev.filter(o => o._id !== id))
  }

  function handleOutfitCreated(outfit: Outfit) {
    setOutfits(prev => [...prev, outfit])
  }

  if (loading) return <p className="px-6 py-8 text-text-muted">Loading...</p>
  if (error) return <p className="px-6 py-8 text-red-500">{error}</p>

  return (
    <>
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <h1 className="text-[28px] font-normal">Saved Outfits</h1>
        <Button onClick={() => setCreatingOutfit(true)}>+ New Outfit</Button>
      </div>
      <div className="relative flex items-center justify-end px-6 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => setFilterOpen(f => !f)}>
          Filter By Tag {filterOpen ? '▲' : '▼'}
        </Button>
        {filterOpen && (
          <div className="absolute top-full right-4 z-10 bg-bg-card border border-border rounded-lg shadow-lg px-4 py-3 flex flex-wrap gap-2 min-w-65 max-w-120">
            {availableTags.length === 0 && (
              <span className="text-text-muted text-sm">No tags on your outfits yet.</span>
            )}
            {availableTags.map(tag => (
              <TagChip
                key={tag}
                label={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
            {selectedTags.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                Clear
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-autofill-200 gap-4 p-6">
        {visibleOutfits.map(outfit => (
          <OutfitCard
            key={outfit._id}
            name={outfit.name}
            items={outfit.items.map(item => ({ label: item.name, imageUrl: item.imageUrl }))}
            onClick={() => setEditingOutfitId(outfit._id)}
            onEdit={() => setEditingOutfitId(outfit._id)}
          />
        ))}
        <button
          className="bg-transparent border-2 border-dashed border-border rounded cursor-pointer flex flex-col items-center justify-center gap-3 text-text-muted text-sm transition-[background,border-color] duration-150 hover:bg-bg-card hover:border-text-muted"
          onClick={() => setCreatingOutfit(true)}
        >
          <span className="text-[48px] leading-none">+</span>
          <span className="text-[18px]">Create outfit</span>
        </button>
      </div>
    </div>
    {editingOutfitId && userId && (
      <EditOutfitModal
        outfitId={editingOutfitId}
        userId={userId}
        onClose={() => setEditingOutfitId(null)}
        onSaved={handleOutfitSaved}
        onDeleted={handleOutfitDeleted}
      />
    )}
    {creatingOutfit && userId && (
      <CreateOutfitModal
        userId={userId}
        onClose={() => setCreatingOutfit(false)}
        onCreated={handleOutfitCreated}
      />
    )}
    </>
  )
}
