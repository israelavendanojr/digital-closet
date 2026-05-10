import { useState } from 'react'
import CategoryTabs, { type Category } from '../components/ui/CategoryTabs'
import ClothingCard from '../components/ui/ClothingCard'
import Button from '../components/ui/Button'

const MOCK_ITEMS: Record<Category, { id: string; label: string; imageUrl?: string }[]> = {
  Tops: [
    { id: '1', label: 'funny monkey shirt' },
    { id: '2', label: 'white button-up' },
    { id: '3', label: 'striped tee' },
    { id: '4', label: 'black hoodie' },
    { id: '5', label: 'floral blouse' },
    { id: '6', label: 'grey crewneck' },
  ],
  Bottoms: [
    { id: '7', label: 'blue jeans' },
    { id: '8', label: 'black slacks' },
    { id: '9', label: 'plaid skirt' },
  ],
  Accessories: [
    { id: '10', label: 'red scarf' },
    { id: '11', label: 'leather belt' },
    { id: '12', label: 'canvas tote' },
  ],
}

export default function LooseClothes() {
  const [category, setCategory] = useState<Category>('Tops')
  const [filterOpen, setFilterOpen] = useState(false)
  const items = MOCK_ITEMS[category]

  return (
    <div className="flex flex-col">
      <CategoryTabs active={category} onChange={setCategory} />
      <div className="flex items-center justify-end px-6 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => setFilterOpen(f => !f)}>
          Filter By Tag {filterOpen ? '▲' : '▼'}
        </Button>
      </div>
      <div className="grid grid-autofill-150 gap-4 p-6">
        {items.map(item => (
          <ClothingCard key={item.id} label={item.label} imageUrl={item.imageUrl} />
        ))}
      </div>
    </div>
  )
}
