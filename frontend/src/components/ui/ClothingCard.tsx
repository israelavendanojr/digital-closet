interface ClothingCardProps {
  label: string
  imageUrl?: string
  tags?: string[]
  onClick?: () => void
}

export default function ClothingCard({ label, imageUrl, onClick }: ClothingCardProps) {
  return (
    <button
      className="bg-bg-card border border-border rounded p-0 cursor-pointer text-left flex flex-col overflow-hidden transition-shadow duration-150 hover:shadow-md shadow-sm"
      onClick={onClick}
    >
      <div className="w-full aspect-square bg-border flex items-center justify-center overflow-hidden">
        {imageUrl
          ? <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
          : <span className="text-[28px] text-text-light">+</span>
        }
      </div>
      <p className="text-[13px] text-text px-2.5 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{label}</p>
    </button>
  )
}
