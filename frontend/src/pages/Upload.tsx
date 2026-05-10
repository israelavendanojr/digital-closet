import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageDropzone from '../components/ui/ImageDropzone'
import Button from '../components/ui/Button'

export default function Upload() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | undefined>()
  const [file, setFile] = useState<File | undefined>()

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <div className="px-6 pt-8 pb-25 flex flex-col gap-3 max-w-140 mx-auto w-full">
      <h1 className="text-[28px] font-normal">Upload Item</h1>
      <p className="text-sm text-text-muted">Add a new piece to your wardrobe</p>
      <div className="mt-2">
        <ImageDropzone onFile={handleFile} preview={preview} />
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <Button variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
        <Button
          disabled={!file}
          onClick={() => navigate('/upload/tags', { state: { preview, fileName: file?.name } })}
        >
          Next: Add Tags
        </Button>
      </div>
    </div>
  )
}
