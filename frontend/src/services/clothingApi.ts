import type { Category } from '../components/ui/CategoryTabs'

export interface ClothingItem {
  _id: string
  userId: string
  name: string
  category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'hatwear'
  tags: string[]
  imageUrl: string
  createdAt: string
}

export const TEST_USER_ID = '6a189b298b9a6ba4050ccce7'

// Maps frontend Category tab labels to backend enum values
const CATEGORY_MAP: Record<Category, ClothingItem['category']> = {
  Tops: 'tops',
  Bottoms: 'bottoms',
  Outerwear: 'outerwear',
  Footwear: 'footwear',
  Headwear: 'hatwear',
  Accessories: 'accessories',
}

export function toBackendCategory(cat: Category): ClothingItem['category'] {
  return CATEGORY_MAP[cat]
}

export async function getAllClothes(userId: string): Promise<ClothingItem[]> {
  const res = await fetch(`/api/clothes/user/${userId}`)
  if (!res.ok) throw new Error(`Failed to fetch clothes: ${res.status}`)
  return res.json()
}

export async function createClothing(formData: FormData): Promise<ClothingItem> {
  const res = await fetch('/api/clothes/', { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`Failed to create item: ${res.status}`)
  return res.json()
}
