export interface OutfitItem {
  _id: string
  name: string
  category: string
  imageUrl: string
  tags: string[]
}

export interface CanvasLayoutEntry {
  clothingId: string
  x: number
  y: number
  width: number
  zIndex: number
  rotation?: number
}

export interface Outfit {
  _id: string
  userId: string
  name: string
  items: OutfitItem[]
  tags: string[]
  isFavorite: boolean
  canvasLayout?: CanvasLayoutEntry[]
  createdAt: string
}

export interface CreateOutfitData {
  userId: string
  name: string
  items: string[]
  tags?: string[]
  isFavorite?: boolean
  canvasLayout?: CanvasLayoutEntry[]
}

export interface UpdateOutfitData {
  name?: string
  items?: string[]
  tags?: string[]
  isFavorite?: boolean
  canvasLayout?: CanvasLayoutEntry[]
}

async function authHeader(getToken: () => Promise<string | null>): Promise<HeadersInit> {
  const token = await getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getAllOutfits(userId: string, getToken: () => Promise<string | null>): Promise<Outfit[]> {
  const res = await fetch(`/api/outfits/user/${userId}`, { headers: await authHeader(getToken) })
  if (!res.ok) throw new Error(`Failed to fetch outfits: ${res.status}`)
  return res.json()
}

export async function getOutfit(id: string, getToken: () => Promise<string | null>): Promise<Outfit> {
  const res = await fetch(`/api/outfits/${id}`, { headers: await authHeader(getToken) })
  if (!res.ok) throw new Error(`Failed to fetch outfit: ${res.status}`)
  return res.json()
}

export async function createOutfit(data: CreateOutfitData, getToken: () => Promise<string | null>): Promise<Outfit> {
  const token = await getToken()
  const res = await fetch('/api/outfits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({
      userId: data.userId,
      name: data.name,
      items: data.items,
      tags: data.tags ?? [],
      isFavorite: data.isFavorite ?? false,
      canvasLayout: data.canvasLayout ?? [],
    }),
  })
  if (!res.ok) throw new Error(`Failed to create outfit: ${res.status}`)
  return res.json()
}

export async function updateOutfit(id: string, data: UpdateOutfitData, getToken: () => Promise<string | null>): Promise<Outfit> {
  const token = await getToken()
  const res = await fetch(`/api/outfits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update outfit: ${res.status}`)
  return res.json()
}

export async function deleteOutfit(id: string, getToken: () => Promise<string | null>): Promise<void> {
  const res = await fetch(`/api/outfits/${id}`, { method: 'DELETE', headers: await authHeader(getToken) })
  if (!res.ok) throw new Error(`Failed to delete outfit: ${res.status}`)
}
