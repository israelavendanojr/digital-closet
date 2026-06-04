import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import ImageDropzone from '../inputs/ImageDropzone'
import TagInput from '../inputs/TagInput'
import Button from '../Button'
import {
  getClothingItem,
  updateClothing,
  deleteClothing,
  toBackendCategory,
  type ClothingItem,
} from '../../../services/clothingApi'
import type { Category } from '../CategoryTabs'

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

interface EditClothingModalProps {
  itemId: string
  initialConfirmDelete?: boolean
  onClose: () => void
  onSaved: (item: ClothingItem) => void
  onDeleted: (id: string) => void
}

export default function EditClothingModal({ itemId, initialConfirmDelete = false, onClose, onSaved, onDeleted }: EditClothingModalProps) {
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
  const [confirmDelete, setConfirmDelete] = useState(initialConfirmDelete)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 160)
  }

  useEffect(() => {
    getClothingItem(itemId, getToken)
      .then(item => {
        setName(item.name)
        setCategory(BACKEND_TO_FRONTEND[item.category])
        setTags(item.tags)
        setPreview(item.imageUrl)
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoadingItem(false))
  }, [itemId])

  function handleFile(f: File) {
    setNewFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('category', toBackendCategory(category as Category) ?? category)
      formData.append('tags', JSON.stringify(tags))
      if (newFile) formData.append('image', newFile)
      const updated = await updateClothing(itemId, formData, getToken)
      onSaved(updated)
      handleClose()
    } catch (err: any) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteClothing(itemId, getToken)
      onDeleted(itemId)
      handleClose()
    } catch (err: any) {
      setSaveError(err.message)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/30 ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
        onClick={handleClose}
      />
      <div className={`relative bg-card rounded-xl shadow-xl overflow-y-auto max-h-[90vh] w-[min(92vw,780px)] flex flex-col ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <h2 className="text-xl font-normal">Edit Item</h2>
          <button
            className="bg-transparent border-none text-text-muted hover:text-text cursor-pointer text-lg p-0 leading-none"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          {loadingItem && <p className="text-text-muted">Loading...</p>}
          {fetchError && <p className="text-red-500">{fetchError}</p>}
          {!loadingItem && !fetchError && (
            <div className="grid grid-cols-2 gap-8 items-start max-sm:grid-cols-1">
              <ImageDropzone onFile={handleFile} preview={preview} />

              <div className="flex flex-col gap-6">
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
                  <Button variant="ghost" onClick={handleClose}>Cancel</Button>
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
          )}
        </div>
      </div>
    </div>
  )
}
