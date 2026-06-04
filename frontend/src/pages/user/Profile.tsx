import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import ClothingCard from '../../components/ui/cards/ClothingCard'
import OutfitCard from '../../components/ui/cards/OutfitCard'
import EditProfileModal from '../../components/ui/modals/EditProfileModal'
import EditClothingModal from '../../components/ui/modals/EditClothingModal'
import EditOutfitModal from '../../components/ui/modals/EditOutfitModal'
import { getAllOutfits, type Outfit } from '../../services/outfitApi'
import { getAllClothes, type ClothingItem } from '../../services/clothingApi'
import { Icon } from '../../components/ui/icons'

export default function Profile() {
  const { userId, getToken } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const [favoriteOutfits, setFavoriteOutfits] = useState<Outfit[]>([])
  const [clothes, setClothes] = useState<ClothingItem[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editInitialDelete, setEditInitialDelete] = useState(false)
  const [editingOutfitId, setEditingOutfitId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    getAllOutfits(userId, getToken)
      .then(outfits => setFavoriteOutfits(outfits.filter(o => o.isFavorite)))
      .catch(() => {})
  }, [userId])

  useEffect(() => {
    if (!userId) return
    getAllClothes(userId, getToken)
      .then(setClothes)
      .catch(() => {})
  }, [userId])

  return (
    <div className="px-6 py-8 flex flex-col gap-8 max-w-200 mx-auto w-full">
      <div className="flex items-center gap-4">
        <div className="w-18 h-18 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted shrink-0 overflow-hidden">
          {user?.imageUrl
            ? <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )
          }
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-medium">@{user?.firstName}'s Closet</h1>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 rounded-full bg-bg-card border border-border hover:bg-border transition-colors text-text-muted hover:text-text"
              aria-label="Edit profile"
            >
              {Icon.edit({ size: 14 })}
            </button>
          </div>
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
                  onEdit={() => navigate(`/outfits/builder/${outfit._id}`)}
                  onDelete={() => setEditingOutfitId(outfit._id)}
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
            <ClothingCard
              key={item._id}
              label={item.name}
              imageUrl={item.imageUrl}
              onEdit={() => { setEditInitialDelete(false); setEditingItemId(item._id) }}
              onDelete={() => { setEditInitialDelete(true); setEditingItemId(item._id) }}
            />
          ))}
        </div>
      </section>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
      {editingItemId && (
        <EditClothingModal
          itemId={editingItemId}
          initialConfirmDelete={editInitialDelete}
          onClose={() => setEditingItemId(null)}
          onSaved={updated => setClothes(prev => prev.map(i => i._id === updated._id ? updated : i))}
          onDeleted={id => setClothes(prev => prev.filter(i => i._id !== id))}
        />
      )}
      {editingOutfitId && userId && (
        <EditOutfitModal
          outfitId={editingOutfitId}
          userId={userId}
          initialConfirmDelete={true}
          onClose={() => setEditingOutfitId(null)}
          onSaved={updated => setFavoriteOutfits(prev => updated.isFavorite ? prev.map(o => o._id === updated._id ? updated : o) : prev.filter(o => o._id !== updated._id))}
          onDeleted={id => setFavoriteOutfits(prev => prev.filter(o => o._id !== id))}
        />
      )}
    </div>
  )
}
