import ClothingCard from '../components/ui/ClothingCard'
import OutfitCard from '../components/ui/OutfitCard'

import uniqloAirismBlack from '../assets/tops/uniqlo_airism_black.avif'
import burgundyTee from '../assets/tops/burgunry_tee.jpeg'
import vintageWashJeans from '../assets/bottoms/vintage_wash_jeans.jpg'
import dunePant from '../assets/bottoms/dune_pant.jpg'
import petrolJacket from '../assets/outerwear/petrol_jacket.jpg'
import onika from '../assets/footwear/onika.jpg'

const MOCK_CLOSET = [
  { id: '1', label: 'Uniqlo Airism Black', imageUrl: uniqloAirismBlack },
  { id: '2', label: 'Burgundy Tee', imageUrl: burgundyTee },
  { id: '3', label: 'Vintage Wash Jeans', imageUrl: vintageWashJeans },
  { id: '4', label: 'Dune Pant', imageUrl: dunePant },
  { id: '5', label: 'Petrol Jacket', imageUrl: petrolJacket },
  { id: '6', label: 'Onika', imageUrl: onika },
]

export default function Profile() {
  return (
    <div className="px-6 py-8 flex flex-col gap-8 max-w-200 mx-auto w-full">
      <div className="flex items-center gap-4">
        <div className="w-18 h-18 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted shrink-0">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <h1 className="text-[22px] font-medium">@harper's Closet</h1>
          <p className="text-sm text-text-muted mt-1">{MOCK_CLOSET.length} items</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Favorite Outfit</h2>
        <div className="max-w-50">
          <OutfitCard
            name="Favorite Outfit"
            items={[
              { label: 'Uniqlo Airism Black', imageUrl: uniqloAirismBlack },
              { label: 'Vintage Wash Jeans', imageUrl: vintageWashJeans },
              { label: 'Petrol Jacket', imageUrl: petrolJacket },
            ]}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">My Closet</h2>
        <div className="grid grid-autofill-140 gap-3.5">
          {MOCK_CLOSET.map(item => (
            <ClothingCard key={item.id} label={item.label} imageUrl={item.imageUrl} />
          ))}
        </div>
      </section>
    </div>
  )
}
