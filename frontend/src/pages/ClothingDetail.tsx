import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import ImageDropzone from '../components/ui/ImageDropzone'
import TagInput from '../components/ui/TagInput'
import Button from '../components/ui/Button'
import {
  getClothingItem,
  updateClothing,
  deleteClothing,
  toBackendCategory,
  type ClothingItem,
} from '../services/clothingApi'
import type { Category } from '../components/ui/CategoryTabs'

const SUGGESTIONS = ['green', 'red', 'chic', 'y2k', 'winter', 'casual', 'formal', 'silly', 'vintage']

const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories'] as const
type CategoryLabel = typeof CATEGORIES[number]

const BACKEND_TO_FRONTEND: Record<ClothingItem['category'], CategoryLabel> = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear',
  footwear: 'Footwear',
  hatwear: 'Headwear',
  accessories: 'Accessories',
}

export default function ClothingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuth()

  const [loadingItem, setLoadingItem] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<CategoryLabel>('Tops')
  const [tags, setTags] = useState<string[]>([])
  const [preview, setPreview] = useState<string | undefined>()
  const [newFile, setNewFile] = useState<File | undefined>()

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getClothingItem(id, getToken)
      .then(item => {
        setName(item.name)
        setCategory(BACKEND_TO_FRONTEND[item.category])
        setTags(item.tags)
        setPreview(item.imageUrl)
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoadingItem(false))
  }, [id])

  function handleFile(f: File) {
    setNewFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!id || !name.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('category', toBackendCategory(category as Category))
      formData.append('tags', JSON.stringify(tags))
      if (newFile) formData.append('image', newFile)
      await updateClothing(id, formData, getToken)
      navigate('/clothes')
    } catch (err: any) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    setDeleting(true)
    try {
      await deleteClothing(id, getToken)
      navigate('/clothes')
    } catch (err: any) {
      setSaveError(err.message)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loadingItem) return <p className="px-6 py-8 text-text-muted">Loading...</p>
  if (fetchError) return <p className="px-6 py-8 text-red-500">{fetchError}</p>

  return (
    <div className="px-6 py-8 max-w-200 mx-auto w-full">
      <div className="grid grid-cols-2 gap-10 items-start max-sm:grid-cols-1">

        <ImageDropzone onFile={handleFile} preview={preview} />

        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-normal">Edit Item</h1>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-muted">Label:</label>
            <input
              className="borderless-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. funny monkey shirt"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-muted">Category:</label>
            <select
              className="borderless-input"
              value={category}
              onChange={e => setCategory(e.target.value as CategoryLabel)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-muted">Tags:</label>
            <TagInput tags={tags} onChange={setTags} suggestions={SUGGESTIONS} />
          </div>

          {saveError && <p className="text-red-500 text-sm">{saveError}</p>}

          <div className="flex gap-3 justify-end mt-2">
            <Button variant="ghost" onClick={() => navigate('/clothes')}>← Back</Button>
            <Button disabled={saving || !name.trim()} onClick={handleSave}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="border-t border-border pt-4 mt-2">
            {!confirmDelete ? (
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
                Delete Item
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-text-muted">Are you sure? This cannot be undone.</p>
                <div className="flex gap-3">
                  <Button size="sm" disabled={deleting} onClick={handleDelete}>
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
