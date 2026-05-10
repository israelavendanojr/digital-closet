import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import ClothingCard from '../components/ui/ClothingCard'

import uniqloAirismBlack from '../assets/tops/uniqlo_airism_black.avif'
import uniqloAirismWhite from '../assets/tops/uniqlo_airism_white.avif'
import burgundyTee from '../assets/tops/burgunry_tee.jpeg'
import blackCollar from '../assets/tops/black_collar.avif'
import vintageWashJeans from '../assets/bottoms/vintage_wash_jeans.jpg'
import lightWashJeans from '../assets/bottoms/light_wash_jeans.avif'
import dunePant from '../assets/bottoms/dune_pant.jpg'
import petrolJacket from '../assets/outerwear/petrol_jacket.jpg'
import leatherJacket from '../assets/outerwear/leather_jacket.avif'
import oliveSweater from '../assets/outerwear/olive_sweater.jpg'
import onika from '../assets/footwear/onika.jpg'
import loaferBlack from '../assets/footwear/loafer_black.jpg'
import brownChelsea from '../assets/footwear/brown_chelsea.webp'
import braceletSilver from '../assets/accesories/bracelet_silver.webp'
import necklaceSilver from '../assets/accesories/necklace_silver.png'
import blackCap from '../assets/hatwear/black_cap.avif'
import yankeeGrey from '../assets/hatwear/yankee_grey.webp'

const ALL_ITEMS = [
  { id: '1', label: 'Uniqlo Airism Black', imageUrl: uniqloAirismBlack },
  { id: '2', label: 'Uniqlo Airism White', imageUrl: uniqloAirismWhite },
  { id: '3', label: 'Burgundy Tee', imageUrl: burgundyTee },
  { id: '4', label: 'Black Collar', imageUrl: blackCollar },
  { id: '5', label: 'Vintage Wash Jeans', imageUrl: vintageWashJeans },
  { id: '6', label: 'Light Wash Jeans', imageUrl: lightWashJeans },
  { id: '7', label: 'Dune Pant', imageUrl: dunePant },
  { id: '8', label: 'Petrol Jacket', imageUrl: petrolJacket },
  { id: '9', label: 'Leather Jacket', imageUrl: leatherJacket },
  { id: '10', label: 'Olive Sweater', imageUrl: oliveSweater },
  { id: '11', label: 'Onika', imageUrl: onika },
  { id: '12', label: 'Black Loafer', imageUrl: loaferBlack },
  { id: '13', label: 'Brown Chelsea', imageUrl: brownChelsea },
  { id: '14', label: 'Silver Bracelet', imageUrl: braceletSilver },
  { id: '15', label: 'Silver Necklace', imageUrl: necklaceSilver },
  { id: '16', label: 'Black Cap', imageUrl: blackCap },
  { id: '17', label: 'Grey Yankee', imageUrl: yankeeGrey },
]

export default function SavedOutfitCreation() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState('')

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <div className="p-6 pb-25 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button
          className="bg-transparent border-none text-sm text-text-muted cursor-pointer p-0 hover:text-text transition-colors duration-150"
          onClick={() => navigate('/outfits')}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-normal">Create Outfit</h1>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-text-muted whitespace-nowrap">Name:</label>
        <input
          className="borderless-input flex-1"
          placeholder="e.g. Weekend Casual"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <p className="text-sm text-text-muted">Select items to include in this outfit</p>
      <div className="grid grid-autofill-150 gap-4">
        {ALL_ITEMS.map(item => (
          <div
            key={item.id}
            className={`relative${selected.includes(item.id) ? ' item-selected-check' : ''}`}
          >
            <ClothingCard
              label={item.label}
              imageUrl={item.imageUrl}
              onClick={() => toggle(item.id)}
            />
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border px-6 py-4 flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => navigate('/outfits')}>Cancel</Button>
        <Button disabled={selected.length === 0 || !name.trim()} onClick={() => navigate('/outfits')}>
          Save &amp; Quit
        </Button>
      </div>
    </div>
  )
}
