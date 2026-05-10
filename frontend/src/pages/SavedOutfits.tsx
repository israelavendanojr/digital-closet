import { useNavigate } from 'react-router-dom'
import OutfitCard from '../components/ui/OutfitCard'
import Button from '../components/ui/Button'

const MOCK_OUTFITS = [
  { id: '1', name: 'Favorite Outfit', items: [{ label: 'monkey shirt' }, { label: 'blue jeans' }, { label: 'red scarf' }] },
  { id: '2', name: 'Work Look', items: [{ label: 'white button-up' }, { label: 'black slacks' }, { label: 'leather belt' }] },
  { id: '3', name: 'Weekend Casual', items: [{ label: 'grey crewneck' }, { label: 'plaid skirt' }] },
]

export default function SavedOutfits() {
  const navigate = useNavigate()

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-normal">Saved Outfits</h1>
        <Button onClick={() => navigate('/outfits/new')}>+ New Outfit</Button>
      </div>
      <div className="grid grid-autofill-200 gap-4">
        {MOCK_OUTFITS.map(outfit => (
          <OutfitCard
            key={outfit.id}
            name={outfit.name}
            items={outfit.items}
            onClick={() => navigate(`/outfits/${outfit.id}`)}
          />
        ))}
        <button
          className="bg-transparent border-2 border-dashed border-border rounded cursor-pointer flex flex-col items-center justify-content gap-2 aspect-square text-text-muted text-sm transition-[background,border-color] duration-150 hover:bg-bg-card hover:border-text-muted"
          onClick={() => navigate('/outfits/new')}
        >
          <span className="text-[28px] leading-none">+</span>
          <span>Create outfit</span>
        </button>
      </div>
    </div>
  )
}
