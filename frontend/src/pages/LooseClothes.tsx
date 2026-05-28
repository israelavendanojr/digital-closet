import { useState, useEffect } from 'react'
import CategoryTabs, { type Category } from '../components/ui/CategoryTabs'
import ClothingCard from '../components/ui/ClothingCard'
import Button from '../components/ui/Button'
import { getAllClothes, toBackendCategory, TEST_USER_ID, type ClothingItem } from '../services/clothingApi'

export default function LooseClothes() {
  const [category, setCategory] = useState<Category>('Tops')
  const [filterOpen, setFilterOpen] = useState(false)
  const [allItems, setAllItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllClothes(TEST_USER_ID)
      .then(setAllItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const items = allItems.filter(item => item.category === toBackendCategory(category))

  return (
    <div className="flex flex-col">
      <CategoryTabs active={category} onChange={setCategory} />
      <div className="flex items-center justify-end px-6 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => setFilterOpen(f => !f)}>
          Filter By Tag {filterOpen ? '▲' : '▼'}
        </Button>
      </div>
      <div className="grid grid-autofill-150 gap-4 p-6">
        {loading && <p className="text-text-muted col-span-full">Loading...</p>}
        {error && <p className="text-red-500 col-span-full">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-text-muted col-span-full">No items in this category.</p>
        )}
        {items.map(item => (
          <ClothingCard key={item._id} label={item.name} imageUrl={item.imageUrl} />
        ))}
      </div>
    </div>
  )
}
