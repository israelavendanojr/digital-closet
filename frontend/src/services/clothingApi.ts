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

// Maps frontend Category tab labels to backend enum values
const CATEGORY_MAP: Partial<Record<Category, ClothingItem['category']>> = {
  Tops: 'tops',
  Bottoms: 'bottoms',
  Outerwear: 'outerwear',
  Footwear: 'footwear',
  Headwear: 'hatwear',
  Accessories: 'accessories',
}

export function toBackendCategory(cat: Category): ClothingItem['category'] | undefined {
  return CATEGORY_MAP[cat]
}

async function authHeader(getToken: () => Promise<string | null>): Promise<HeadersInit> {
  const token = await getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getAllClothes(userId: string, getToken: () => Promise<string | null>): Promise<ClothingItem[]> {
  const res = await fetch(`/api/clothes/user/${userId}`, { headers: await authHeader(getToken) })
  if (!res.ok) throw new Error(`Failed to fetch clothes: ${res.status}`)
  return res.json()
}

export async function createClothing(formData: FormData, getToken: () => Promise<string | null>): Promise<ClothingItem> {
  const res = await fetch('/api/clothes', { method: 'POST', headers: await authHeader(getToken), body: formData })
  if (!res.ok) throw new Error(`Failed to create item: ${res.status}`)
  return res.json()
}

export async function getClothingItem(id: string, getToken: () => Promise<string | null>): Promise<ClothingItem> {
  const res = await fetch(`/api/clothes/${id}`, { headers: await authHeader(getToken) })
  if (!res.ok) throw new Error(`Failed to fetch item: ${res.status}`)
  return res.json()
}

export async function updateClothing(id: string, formData: FormData, getToken: () => Promise<string | null>): Promise<ClothingItem> {
  const res = await fetch(`/api/clothes/${id}`, { method: 'PUT', headers: await authHeader(getToken), body: formData })
  if (!res.ok) throw new Error(`Failed to update item: ${res.status}`)
  return res.json()
}

export async function deleteClothing(id: string, getToken: () => Promise<string | null>): Promise<void> {
  const res = await fetch(`/api/clothes/${id}`, { method: 'DELETE', headers: await authHeader(getToken) })
  if (!res.ok) throw new Error(`Failed to delete item: ${res.status}`)
}
