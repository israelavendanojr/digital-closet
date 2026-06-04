import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { removeBackground } from '@imgly/background-removal'
import ImageDropzone from '../inputs/ImageDropzone'
import TagInput from '../inputs/TagInput'
import Button from '../Button'
import {
  createClothing,
  toBackendCategory,
  type ClothingItem,
} from '../../../services/clothingApi'
import type { Category } from '../CategoryTabs'

const SUGGESTIONS = ['green', 'red', 'chic', 'y2k', 'winter', 'casual', 'formal', 'silly', 'vintage']

const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories'] as const
type CategoryLabel = typeof CATEGORIES[number]

interface CreateClothingModalProps {
  onClose: () => void
  onCreated: (item: ClothingItem) => void
}

export default function CreateClothingModal({ onClose, onCreated }: CreateClothingModalProps) {
  const { getToken } = useAuth()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<CategoryLabel>('Tops')
  const [tags, setTags] = useState<string[]>([])
  const [preview, setPreview] = useState<string | undefined>()
  const [newFile, setNewFile] = useState<File | undefined>()

  const [removingBg, setRemovingBg] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 160)
  }

  async function handleFile(f: File) {
    setPreview(URL.createObjectURL(f))
    setNewFile(f)
    setRemovingBg(true)
    try {
      const blob = await removeBackground(f)
      const processed = new File([blob], f.name.replace(/\.[^.]+$/, '.png'), { type: 'image/png' })
      setNewFile(processed)
      setPreview(URL.createObjectURL(blob))
    } catch (err) {
      console.error('Background removal failed:', err)
    } finally {
      setRemovingBg(false)
    }
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
      const created = await createClothing(formData, getToken)
      onCreated(created)
      handleClose()
    } catch (err: any) {
      setSaveError(err.message)
      setSaving(false)
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
          <h2 className="text-xl font-normal">Add Item</h2>
          <button
            className="bg-transparent border-none text-text-muted hover:text-text cursor-pointer text-lg p-0 leading-none"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-8 items-start max-sm:grid-cols-1">
            <ImageDropzone onFile={handleFile} preview={preview} removing={removingBg} />

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
                <Button disabled={saving || removingBg || !name.trim()} onClick={handleSave}>
                  {saving ? 'Saving...' : 'Add Item'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
