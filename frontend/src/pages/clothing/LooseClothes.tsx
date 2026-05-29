import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import CategoryTabs, { type Category } from '../../components/ui/CategoryTabs'
import ClothingCard from '../../components/ui/ClothingCard'
import TagChip from '../../components/ui/TagChip'
import Button from '../../components/ui/Button'
import { getAllClothes, toBackendCategory, type ClothingItem } from '../../services/clothingApi'

export default function LooseClothes() {
  const navigate = useNavigate()
  const { userId, getToken } = useAuth()
  const [category, setCategory] = useState<Category>('All')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allItems, setAllItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    getAllClothes(userId, getToken)
      .then(setAllItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  const availableTags = [...new Set(allItems.flatMap(i => i.tags))].sort()

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const backendCat = toBackendCategory(category)
  const categoryFiltered = backendCat ? allItems.filter(item => item.category === backendCat) : allItems
  const items = selectedTags.length === 0
    ? categoryFiltered
    : categoryFiltered.filter(item => selectedTags.some(t => item.tags.includes(t)))

  return (
    <div className="flex flex-col">
      <CategoryTabs active={category} onChange={setCategory} />
      <div className="relative flex items-center justify-end px-6 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => setFilterOpen(f => !f)}>
          Filter By Tag {filterOpen ? '▲' : '▼'}
        </Button>
        {filterOpen && (
          <div className="absolute top-full right-4 z-10 bg-bg-card border border-border rounded-lg shadow-lg px-4 py-3 flex flex-wrap gap-2 min-w-65 max-w-120">
            {availableTags.length === 0 && (
              <span className="text-text-muted text-sm">No tags on your items yet.</span>
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
      <div className="grid grid-autofill-150 gap-4 p-6">
        {loading && <p className="text-text-muted col-span-full">Loading...</p>}
        {error && <p className="text-red-500 col-span-full">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-text-muted col-span-full">No items in this category.</p>
        )}
        {items.map(item => (
          <ClothingCard key={item._id} label={item.name} imageUrl={item.imageUrl} onClick={() => navigate(`/clothes/${item._id}`)} />
        ))}
      </div>
    </div>
  )
}
