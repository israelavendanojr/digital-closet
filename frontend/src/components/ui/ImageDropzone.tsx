import { useRef } from 'react'

interface ImageDropzoneProps {
  onFile: (file: File) => void
  preview?: string
}

export default function ImageDropzone({ onFile, preview }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      className="border-2 border-dashed border-border rounded bg-bg-card cursor-pointer flex items-center justify-center min-h-70 transition-[border-color,background] duration-150 relative overflow-hidden hover:border-text-muted hover:bg-border"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-contain max-h-100" />
      ) : (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <div className="text-text-muted mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-base font-medium text-text">Upload your item</p>
          <p className="text-sm text-text-muted">Or just drop here!!!</p>
          <p className="text-xs text-text-light">(browser permission required for camera)</p>
        </div>
      )}
    </div>
  )
}
