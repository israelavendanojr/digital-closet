import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { removeBackground } from '@imgly/background-removal'
import ImageDropzone from '../../components/ui/ImageDropzone'
import Button from '../../components/ui/Button'

export default function Upload() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | undefined>()
  const [file, setFile] = useState<File | undefined>()
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  async function handleFile(f: File) {
    setFile(undefined)
    setPreview(URL.createObjectURL(f))
    setProcessing(true)
    try {
      const blob = await removeBackground(f)
      const processed = new File([blob], f.name.replace(/\.[^.]+$/, '.png'), { type: 'image/png' })
      setFile(processed)
      setPreview(URL.createObjectURL(blob))
    } catch (err) {
      console.error('Background removal failed, using original:', err)
      setFile(f)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="px-6 pt-8 pb-25 flex flex-col gap-1 max-w-220 mx-auto w-full">
      <h1 className="text-[36px] font-light">Upload Item</h1>
      <p className="text-sm text-text-muted font-light">Add a new piece to your wardrobe</p>
      <div className="mt-6 relative">
        <ImageDropzone onFile={handleFile} preview={preview} />
        {processing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
            <div className="bg-white rounded-lg px-5 py-3 text-sm font-medium text-gray-800 shadow-lg">
              Removing background…
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <Button variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
        <Button
          disabled={!file || processing}
          onClick={() => navigate('/upload/tags', { state: { preview, fileName: file?.name, file } })}
        >
          {processing ? 'Processing…' : 'Next: Add Tags'}
        </Button>
      </div>
    </div>
  )
}
