import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TagInput from '../components/ui/TagInput'
import Button from '../components/ui/Button'

const SUGGESTIONS = ['green', 'red', 'chic', 'y2k', 'winter', 'casual', 'formal', 'silly', 'vintage']

export default function UploadTags() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { preview?: string; fileName?: string } | null
  const preview = state?.preview
  const [label, setLabel] = useState(state?.fileName?.replace(/\.[^.]+$/, '') ?? '')
  const [tags, setTags] = useState<string[]>([])

  return (
    <div className="px-6 py-8 max-w-200 mx-auto w-full">
      <div className="grid grid-cols-2 gap-10 items-start max-sm:grid-cols-1">
        <div className="rounded overflow-hidden bg-bg-card aspect-square flex items-center justify-center">
          {preview
            ? <img src={preview} alt="Item preview" className="w-full h-full object-contain" />
            : <div className="text-text-muted text-sm">No image</div>
          }
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-normal">Name &amp; Tags</h1>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-muted">Label:</label>
            <input
              className="borderless-input"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. funny monkey shirt"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-muted">Tags:</label>
            <TagInput tags={tags} onChange={setTags} suggestions={SUGGESTIONS} />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="ghost" onClick={() => navigate('/upload')}>← Back</Button>
            <Button
              disabled={!label.trim()}
              onClick={() => navigate('/upload/confirm', { state: { preview, label, tags } })}
            >
              Next: Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
