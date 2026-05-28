import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TagChip from '../components/ui/TagChip'
import Button from '../components/ui/Button'
import { createClothing, TEST_USER_ID, toBackendCategory } from '../services/clothingApi'
import type { Category } from '../components/ui/CategoryTabs'

export default function UploadConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { preview?: string; label?: string; tags?: string[]; category?: string; file?: File } | null
  const { preview, label = 'Unnamed item', tags = [], category = 'Tops', file } = state ?? {}
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('userId', TEST_USER_ID)
      formData.append('name', label)
      formData.append('category', toBackendCategory(category as Category))
      formData.append('tags', JSON.stringify(tags))
      await createClothing(formData)
      navigate('/clothes')
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="px-6 py-8 max-w-200 mx-auto w-full flex flex-col gap-6">
      <h1 className="text-2xl font-normal">Confirm Upload</h1>
      <div className="grid grid-cols-2 gap-10 items-start max-sm:grid-cols-1">
        <div className="rounded overflow-hidden bg-bg-card aspect-square flex items-center justify-center">
          {preview
            ? <img src={preview} alt={label} className="w-full h-full object-contain" />
            : <div className="text-text-muted text-sm">No image</div>
          }
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.5px] text-text-muted">Label</span>
            <span className="text-lg font-medium">{label}</span>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-[0.5px] text-text-muted">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => <TagChip key={t} label={t} />)}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2.5 mt-3">
            <Button onClick={handleConfirm} disabled={loading || !file}>{loading ? 'Uploading...' : 'Confirm'}</Button>
            <Button variant="ghost" onClick={() => navigate('/upload')}>Reupload</Button>
            <Button variant="ghost" onClick={() => navigate('/upload/tags', { state: { preview, label, file } })}>Retake Tags</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
