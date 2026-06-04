import { cn } from '../../lib/cn'

export type Category = 'All' | 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Headwear' | 'Accessories'

interface CategoryTabsProps {
  active: Category
  onChange: (cat: Category) => void
}

const CATEGORIES: Category[] = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories']

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={cn(
            'font-sans font-semibold text-[15px] px-[17px] py-[9px] rounded-pill border cursor-pointer transition-all duration-150 whitespace-nowrap',
            active === cat
              ? 'text-ink bg-bg-soft border-border shadow-sm font-bold'
              : 'text-ink-soft border-transparent hover:text-ink hover:bg-[rgba(63,58,49,.04)]',
          )}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
