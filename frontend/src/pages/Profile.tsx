import { useState, useEffect } from 'react'
import ClothingCard from '../components/ui/ClothingCard'
import OutfitCard from '../components/ui/OutfitCard'
import { getAllOutfits, TEST_USER_ID, type Outfit } from '../services/outfitApi'
import { getAllClothes, type ClothingItem } from '../services/clothingApi'

export default function Profile() {
  const [favoriteOutfits, setFavoriteOutfits] = useState<Outfit[]>([])
  const [clothes, setClothes] = useState<ClothingItem[]>([])

  useEffect(() => {
    getAllOutfits(TEST_USER_ID)
      .then(outfits => setFavoriteOutfits(outfits.filter(o => o.isFavorite)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    getAllClothes(TEST_USER_ID)
      .then(setClothes)
      .catch(() => {})
  }, [])

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
          <p className="text-sm text-text-muted mt-1">{clothes.length} items</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Favorite Outfits</h2>
        {favoriteOutfits.length === 0
          ? <p className="text-sm text-text-muted">No favorite outfits yet.</p>
          : (
            <div className="grid grid-autofill-140 gap-3.5">
              {favoriteOutfits.map(outfit => (
                <OutfitCard
                  key={outfit._id}
                  name={outfit.name}
                  items={outfit.items.map(i => ({ label: i.name, imageUrl: i.imageUrl }))}
                />
              ))}
            </div>
          )
        }
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">My Closet</h2>
        <div className="grid grid-autofill-140 gap-3.5">
          {clothes.map(item => (
            <ClothingCard key={item._id} label={item.name} imageUrl={item.imageUrl} />
          ))}
        </div>
      </section>
    </div>
  )
}
