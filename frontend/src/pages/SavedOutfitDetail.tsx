import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import ClothingCard from '../components/ui/ClothingCard'

const MOCK_OUTFITS: Record<string, { name: string; items: { id: string; label: string }[] }> = {
  '1': { name: 'Favorite Outfit', items: [{ id: '1', label: 'monkey shirt' }, { id: '7', label: 'blue jeans' }, { id: '10', label: 'red scarf' }] },
  '2': { name: 'Work Look', items: [{ id: '2', label: 'white button-up' }, { id: '8', label: 'black slacks' }, { id: '11', label: 'leather belt' }] },
  '3': { name: 'Weekend Casual', items: [{ id: '4', label: 'grey crewneck' }, { id: '9', label: 'plaid skirt' }] },
}

export default function SavedOutfitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const outfit = id ? MOCK_OUTFITS[id] : null

  if (!outfit) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-75 gap-4">
        <p>Outfit not found.</p>
        <Button onClick={() => navigate('/outfits')}>Back to Outfits</Button>
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button
          className="bg-transparent border-none text-sm text-text-muted cursor-pointer p-0 hover:text-text transition-colors duration-150"
          onClick={() => navigate('/outfits')}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-normal flex-1">{outfit.name}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm">More...</Button>
        </div>
      </div>
      <p className="text-base text-text-muted italic">Does this look good?</p>
      <div className="grid grid-autofill-160 gap-4">
        {outfit.items.map(item => (
          <ClothingCard key={item.id} label={item.label} />
        ))}
      </div>
    </div>
  )
}
