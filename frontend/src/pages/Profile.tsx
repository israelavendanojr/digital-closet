import ClothingCard from '../components/ui/ClothingCard'
import OutfitCard from '../components/ui/OutfitCard'

const MOCK_CLOSET = [
  { id: '1', label: 'monkey shirt' },
  { id: '2', label: 'white button-up' },
  { id: '3', label: 'striped tee' },
  { id: '4', label: 'grey crewneck' },
  { id: '7', label: 'blue jeans' },
  { id: '8', label: 'black slacks' },
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
            items={[{ label: 'monkey shirt' }, { label: 'blue jeans' }, { label: 'red scarf' }]}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">My Closet</h2>
        <div className="grid grid-autofill-140 gap-3.5">
          {MOCK_CLOSET.map(item => (
            <ClothingCard key={item.id} label={item.label} />
          ))}
        </div>
      </section>
    </div>
  )
}
