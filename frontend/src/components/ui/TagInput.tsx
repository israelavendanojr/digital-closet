import { useState } from 'react'
import TagChip from './TagChip'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export default function TagInput({
  tags,
  onChange,
  suggestions = [],
  placeholder = 'Add your own...',
}: TagInputProps) {
  const [input, setInput] = useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter(t => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
  }

  const unusedSuggestions = suggestions.filter(s => !tags.includes(s))

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <TagChip key={tag} label={tag} onRemove={() => removeTag(tag)} />
        ))}
      </div>
      <div className="flex items-center">
        <input
          className="borderless-input w-full text-[14px] placeholder:text-text-light"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={placeholder}
        />
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unusedSuggestions.map(s => (
            <button
              key={s}
              className="bg-transparent border border-border rounded-pill text-[13px] text-text-muted px-2.5 py-1 cursor-pointer transition-[background,color] duration-150 hover:bg-bg-card hover:text-text"
              onClick={() => addTag(s)}
            >
              {s} +
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
