import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import ClothingCard from '../components/ui/ClothingCard'
import OutfitCard from '../components/ui/OutfitCard'
import { getAllClothes, type ClothingItem } from '../services/clothingApi'
import { getAllOutfits, type Outfit } from '../services/outfitApi'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Home() {
  const navigate = useNavigate()
  const { userId, getToken } = useAuth()
  const { user } = useUser()

  const [clothes, setClothes] = useState<ClothingItem[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      getAllClothes(userId, getToken),
      getAllOutfits(userId, getToken),
    ])
      .then(([c, o]) => { setClothes(c); setOutfits(o) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  const recentItems = [...clothes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  const outfitOfDay = outfits.length > 0
    ? outfits[new Date().getDate() % outfits.length]
    : null

  return (
    <div className="flex flex-col px-4 md:px-6 pt-10 pb-24 gap-10 w-full max-w-3xl mx-auto">

      {/* Greeting */}
      <section className="flex flex-col gap-1">
        <h1 className="font-display text-[38px] font-light tracking-[-1.5px] leading-tight">
          {getGreeting()}{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="text-muted text-sm">{formatDate()}</p>
      </section>

      {/* Stats */}
      <section className="flex gap-3">
        <button
          className="flex flex-col items-start bg-surface border border-border rounded-xl px-5 py-4 flex-1 cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => navigate('/clothes')}
        >
          <span className="text-[28px] font-display font-light leading-none">
            {loading ? '—' : clothes.length}
          </span>
          <span className="text-muted text-sm mt-1">items</span>
        </button>
        <button
          className="flex flex-col items-start bg-surface border border-border rounded-xl px-5 py-4 flex-1 cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => navigate('/outfits')}
        >
          <span className="text-[28px] font-display font-light leading-none">
            {loading ? '—' : outfits.length}
          </span>
          <span className="text-muted text-sm mt-1">outfits</span>
        </button>
      </section>

      {/* Recently Added */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-light tracking-[-0.5px]">Recently Added</h2>
          <Link to="/clothes" className="text-sm text-clay hover:text-clay-deep transition-colors">
            See all
          </Link>
        </div>

        {loading && (
          <p className="text-muted text-sm">Loading...</p>
        )}

        {!loading && recentItems.length === 0 && (
          <p className="text-muted text-sm">
            No items yet —{' '}
            <Link to="/upload" className="text-clay hover:text-clay-deep transition-colors">
              upload your first piece
            </Link>
          </p>
        )}

        {!loading && recentItems.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {recentItems.map(item => (
              <div key={item._id} className="w-[130px] flex-shrink-0">
                <ClothingCard
                  label={item.name}
                  imageUrl={item.imageUrl}
                  onClick={() => navigate(`/clothes/${item._id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Outfit of the Day */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-light tracking-[-0.5px]">Outfit of the Day</h2>
          <Link to="/outfits" className="text-sm text-clay hover:text-clay-deep transition-colors">
            See all
          </Link>
        </div>

        {loading && (
          <p className="text-muted text-sm">Loading...</p>
        )}

        {!loading && !outfitOfDay && (
          <p className="text-muted text-sm">
            No outfits yet —{' '}
            <Link to="/outfits" className="text-clay hover:text-clay-deep transition-colors">
              create one
            </Link>
          </p>
        )}

        {!loading && outfitOfDay && (
          <div className="w-[200px]">
            <OutfitCard
              name={outfitOfDay.name}
              items={outfitOfDay.items.map(i => ({ label: i.name, imageUrl: i.imageUrl }))}
              onClick={() => navigate(`/outfits/${outfitOfDay._id}`)}
            />
          </div>
        )}
      </section>

    </div>
  )
}
