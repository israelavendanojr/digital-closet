import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import ClothingCard from '../components/ui/ClothingCard'

import uniqloAirismBlack from '../assets/tops/uniqlo_airism_black.avif'
import petrolJacket from '../assets/outerwear/petrol_jacket.jpg'
import vintageWashJeans from '../assets/bottoms/vintage_wash_jeans.jpg'
import onika from '../assets/footwear/onika.jpg'

const MOCK_OUTFITS: Record<string, { name: string; items: { id: string; label: string; imageUrl?: string }[] }> = {
  '1': {
    name: 'Daily Fit',
    items: [
      { id: '1', label: 'Uniqlo Airism Black', imageUrl: uniqloAirismBlack },
      { id: '2', label: 'Vintage Wash Jeans', imageUrl: vintageWashJeans },
      { id: '3', label: 'Petrol Jacket', imageUrl: petrolJacket },
      { id: '4', label: 'Onika', imageUrl: onika },
    ],
  },
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
          <ClothingCard key={item.id} label={item.label} imageUrl={item.imageUrl} />
        ))}
      </div>
    </div>
  )
}
