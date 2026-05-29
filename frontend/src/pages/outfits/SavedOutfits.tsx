import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import OutfitCard from '../../components/ui/OutfitCard'
import Button from '../../components/ui/Button'
import { getAllOutfits, type Outfit } from '../../services/outfitApi'

export default function SavedOutfits() {
  const navigate = useNavigate()
  const { userId, getToken } = useAuth()
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    getAllOutfits(userId, getToken)
      .then(setOutfits)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <p className="px-6 py-8 text-text-muted">Loading...</p>
  if (error) return <p className="px-6 py-8 text-red-500">{error}</p>

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-normal">Saved Outfits</h1>
        <Button onClick={() => navigate('/outfits/new')}>+ New Outfit</Button>
      </div>
      <div className="grid grid-autofill-200 gap-4">
        {outfits.map(outfit => (
          <OutfitCard
            key={outfit._id}
            name={outfit.name}
            items={outfit.items.map(item => ({ label: item.name, imageUrl: item.imageUrl }))}
            onClick={() => navigate(`/outfits/${outfit._id}`)}
          />
        ))}
        <button
          className="bg-transparent border-2 border-dashed border-border rounded cursor-pointer flex flex-col items-center justify-center gap-3 text-text-muted text-sm transition-[background,border-color] duration-150 hover:bg-bg-card hover:border-text-muted"
          onClick={() => navigate('/outfits/new')}
        >
          <span className="text-[48px] leading-none">+</span>
          <span className="text-[18px]">Create outfit</span>
        </button>
      </div>
    </div>
  )
}
