import { useState } from 'react'
import CategoryTabs, { type Category } from '../components/ui/CategoryTabs'
import ClothingCard from '../components/ui/ClothingCard'
import Button from '../components/ui/Button'

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

import blackCap from '../assets/headwear/black_cap.avif'
import yankeeGrey from '../assets/headwear/yankee_grey.webp'

const MOCK_ITEMS: Record<Category, { id: string; label: string; imageUrl?: string }[]> = {
  Tops: [
    { id: '1', label: 'Uniqlo Airism Black', imageUrl: uniqloAirismBlack },
    { id: '2', label: 'Uniqlo Airism White', imageUrl: uniqloAirismWhite },
    { id: '3', label: 'Burgundy Tee', imageUrl: burgundyTee },
    { id: '4', label: 'Black Collar', imageUrl: blackCollar },
  ],
  Bottoms: [
    { id: '5', label: 'Vintage Wash Jeans', imageUrl: vintageWashJeans },
    { id: '6', label: 'Light Wash Jeans', imageUrl: lightWashJeans },
    { id: '7', label: 'Dune Pant', imageUrl: dunePant },
  ],
  Outerwear: [
    { id: '8', label: 'Petrol Jacket', imageUrl: petrolJacket },
    { id: '9', label: 'Leather Jacket', imageUrl: leatherJacket },
    { id: '10', label: 'Olive Sweater', imageUrl: oliveSweater },
  ],
  Footwear: [
    { id: '11', label: 'Onika', imageUrl: onika },
    { id: '12', label: 'Black Loafer', imageUrl: loaferBlack },
    { id: '13', label: 'Brown Chelsea', imageUrl: brownChelsea },
  ],
  Accessories: [
    { id: '14', label: 'Silver Bracelet', imageUrl: braceletSilver },
    { id: '15', label: 'Silver Necklace', imageUrl: necklaceSilver },
  ],
  Headwear: [
    { id: '16', label: 'Black Cap', imageUrl: blackCap },
    { id: '17', label: 'Grey Yankee', imageUrl: yankeeGrey },
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
