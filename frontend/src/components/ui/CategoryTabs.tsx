import { cn } from '../../lib/cn'

export type Category = 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories' | 'Hatwear'

interface CategoryTabsProps {
  active: Category
  onChange: (cat: Category) => void
}

const CATEGORIES: Category[] = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories', 'Hatwear']

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex border-b border-border">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={cn(
            'bg-transparent border-none text-[15px] px-5 py-3 cursor-pointer relative transition-colors duration-150',
            active === cat
              ? 'text-text font-medium tab-active-bar'
              : 'text-text-muted hover:text-text',
          )}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
