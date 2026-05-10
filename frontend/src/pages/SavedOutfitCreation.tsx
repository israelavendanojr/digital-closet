import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import ClothingCard from '../components/ui/ClothingCard'

const ALL_ITEMS = [
  { id: '1', label: 'monkey shirt' },
  { id: '2', label: 'white button-up' },
  { id: '3', label: 'striped tee' },
  { id: '4', label: 'grey crewneck' },
  { id: '7', label: 'blue jeans' },
  { id: '8', label: 'black slacks' },
  { id: '9', label: 'plaid skirt' },
  { id: '10', label: 'red scarf' },
]

export default function SavedOutfitCreation() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState('')

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <div className="p-6 pb-25 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button
          className="bg-transparent border-none text-sm text-text-muted cursor-pointer p-0 hover:text-text transition-colors duration-150"
          onClick={() => navigate('/outfits')}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-normal">Create Outfit</h1>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-text-muted whitespace-nowrap">Name:</label>
        <input
          className="borderless-input flex-1"
          placeholder="e.g. Weekend Casual"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <p className="text-sm text-text-muted">Select items to include in this outfit</p>
      <div className="grid grid-autofill-150 gap-4">
        {ALL_ITEMS.map(item => (
          <div
            key={item.id}
            className={`relative${selected.includes(item.id) ? ' item-selected-check' : ''}`}
          >
            <ClothingCard
              label={item.label}
              onClick={() => toggle(item.id)}
            />
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border px-6 py-4 flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => navigate('/outfits')}>Cancel</Button>
        <Button disabled={selected.length === 0 || !name.trim()} onClick={() => navigate('/outfits')}>
          Save &amp; Quit
        </Button>
      </div>
    </div>
  )
}
