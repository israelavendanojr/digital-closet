import { useRef, useState } from 'react'

interface ImageDropzoneProps {
  onFile: (file: File) => void
  preview?: string
  removing?: boolean
}

export default function ImageDropzone({ onFile, preview, removing }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={`rounded-xl cursor-pointer flex items-center justify-center min-h-[340px] transition-all duration-200 relative overflow-hidden border-2 border-dashed
        ${isDragging
          ? 'border-accent bg-accent/8 scale-[1.01]'
          : preview
            ? 'border-transparent bg-transparent'
            : 'border-border bg-bg-card hover:border-text-muted hover:bg-hover'
        }`}
      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
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

      {removing ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 min-h-80">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="text-sm text-text-muted font-medium">Removing background…</p>
        </div>
      ) : preview ? (
        <div className="group w-full h-full relative">
          <img src={preview} alt="Preview" className="w-full h-full object-contain max-h-[320px] rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-white text-sm font-medium">Change photo</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-8 py-12 text-center select-none">
          <div className={`transition-colors duration-200 ${isDragging ? 'text-accent' : 'text-text-muted'}`}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className={`text-base font-medium transition-colors duration-200 ${isDragging ? 'text-accent' : 'text-text'}`}>
              {isDragging ? 'Drop to upload' : 'Upload a photo'}
            </p>
            <p className="text-sm text-text-muted font-light">
              Drag & drop or <span className="underline underline-offset-2">browse files</span>
            </p>
          </div>
          <p className="text-xs text-text-light mt-1">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  )
}
