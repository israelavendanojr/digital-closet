import { TEST_USER_ID } from './clothingApi'

export { TEST_USER_ID }

export interface OutfitItem {
  _id: string
  name: string
  category: string
  imageUrl: string
  tags: string[]
}

export interface Outfit {
  _id: string
  userId: string
  name: string
  items: OutfitItem[]
  tags: string[]
  isFavorite: boolean
  createdAt: string
}

export interface CreateOutfitData {
  userId: string
  name: string
  items: string[]
  tags?: string[]
  isFavorite?: boolean
}

export interface UpdateOutfitData {
  name?: string
  items?: string[]
  tags?: string[]
  isFavorite?: boolean
}

export async function getAllOutfits(userId: string): Promise<Outfit[]> {
  const res = await fetch(`/api/outfits/user/${userId}`)
  if (!res.ok) throw new Error(`Failed to fetch outfits: ${res.status}`)
  return res.json()
}

export async function getOutfit(id: string): Promise<Outfit> {
  const res = await fetch(`/api/outfits/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch outfit: ${res.status}`)
  return res.json()
}

export async function createOutfit(data: CreateOutfitData): Promise<Outfit> {
  const res = await fetch('/api/outfits/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: data.userId,
      name: data.name,
      items: data.items,
      tags: data.tags ?? [],
      isFavorite: data.isFavorite ?? false,
    }),
  })
  if (!res.ok) throw new Error(`Failed to create outfit: ${res.status}`)
  return res.json()
}

export async function updateOutfit(id: string, data: UpdateOutfitData): Promise<Outfit> {
  const res = await fetch(`/api/outfits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update outfit: ${res.status}`)
  return res.json()
}

export async function deleteOutfit(id: string): Promise<void> {
  const res = await fetch(`/api/outfits/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Failed to delete outfit: ${res.status}`)
}
