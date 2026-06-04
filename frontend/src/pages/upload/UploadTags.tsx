import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TagInput from '../../components/ui/inputs/TagInput'
import Button from '../../components/ui/Button'
import BgRemovalWorker from './bgRemoval.worker?worker'

const SUGGESTIONS = ['green', 'red', 'chic', 'y2k', 'winter', 'casual', 'formal', 'silly', 'vintage']

const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories'] as const
type CategoryLabel = typeof CATEGORIES[number]

export default function UploadTags() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as { fileName?: string; file?: File; alreadyProcessed?: boolean } | null

  const [preview, setPreview] = useState<string | undefined>(() =>
    routeState?.file ? URL.createObjectURL(routeState.file) : undefined
  )
  const [file, setFile] = useState<File | undefined>(routeState?.file)
  const [processing, setProcessing] = useState(!!routeState?.file && !routeState.alreadyProcessed)
  const [label, setLabel] = useState(routeState?.fileName?.replace(/\.[^.]+$/, '') ?? '')
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<CategoryLabel>('Tops')

  useEffect(() => {
    if (!routeState?.file) { navigate('/upload', { replace: true }); return }
  }, [])

  useEffect(() => {
    if (!routeState?.file || routeState.alreadyProcessed) return
    const worker = new BgRemovalWorker()

    worker.onmessage = (e: MessageEvent<{ ok: boolean; blob?: Blob }>) => {
      if (e.data.ok && e.data.blob) {
        const processed = new File(
          [e.data.blob],
          (routeState.fileName ?? 'image').replace(/\.[^.]+$/, '.png'),
          { type: 'image/png' }
        )
        setFile(processed)
        setPreview(URL.createObjectURL(e.data.blob))
      }
      setProcessing(false)
      worker.terminate()
    }

    worker.postMessage(routeState.file)
    return () => worker.terminate()
  }, [])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <div className="px-6 py-8 max-w-200 mx-auto w-full">
      <div className="grid grid-cols-2 gap-10 items-start max-sm:grid-cols-1">
        <div className="rounded overflow-hidden bg-bg-card aspect-square flex items-center justify-center relative">
          {preview
            ? <img src={preview} alt="Item preview" className="w-full h-full object-contain" />
            : <div className="text-text-muted text-sm">No image</div>
          }
          {processing && (
            <div className="absolute inset-0 flex items-center justify-center bg-text/25 rounded">
              <div className="bg-bg-card text-text text-sm font-light px-5 py-3 rounded shadow">
                Removing background…
              </div>
            </div>
          )}
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
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="ghost" onClick={() => navigate('/upload')}>← Back</Button>
            <Button
              disabled={!label.trim() || processing}
              onClick={() => navigate('/upload/confirm', { state: { preview, label, tags, category, file } })}
            >
              {processing ? 'Processing…' : 'Next: Confirm'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
