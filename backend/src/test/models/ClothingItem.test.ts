import { describe, it, expect } from 'vitest'
import ClothingItem from '../../models/ClothingItem.js'

const VALID_ITEM = {
  userId: 'user_123',
  name: 'Blue Jeans',
  category: 'bottoms' as const,
  imageUrl: '/uploads/test.jpg',
}

describe('ClothingItem model', () => {
  // A document with all required fields is persisted and returns a Mongoose _id
  it('saves a valid item', async () => {
    const item = await ClothingItem.create(VALID_ITEM)
    expect(item._id).toBeDefined()
    expect(item.name).toBe('Blue Jeans')
    expect(item.userId).toBe('user_123')
  })

  // Mongoose timestamps option automatically sets createdAt as a Date
  it('adds createdAt timestamp automatically', async () => {
    const item = await ClothingItem.create(VALID_ITEM)
    expect(item.createdAt).toBeInstanceOf(Date)
  })

  // When tags are omitted, the schema defaults to an empty array
  it('defaults tags to an empty array', async () => {
    const item = await ClothingItem.create(VALID_ITEM)
    expect(item.tags).toEqual([])
  })

  // Tags array is stored exactly as provided
  it('saves provided tags', async () => {
    const item = await ClothingItem.create({ ...VALID_ITEM, tags: ['casual', 'denim'] })
    expect(item.tags).toEqual(['casual', 'denim'])
  })

  // All six enum values defined on the schema are accepted without error
  it('accepts all valid category values', async () => {
    const categories = ['tops', 'bottoms', 'outerwear', 'footwear', 'accessories', 'hatwear'] as const
    for (const category of categories) {
      const item = await ClothingItem.create({ ...VALID_ITEM, category })
      expect(item.category).toBe(category)
    }
  })

  // A value outside the enum causes a Mongoose ValidationError
  it('rejects an invalid category', async () => {
    await expect(
      ClothingItem.create({ ...VALID_ITEM, category: 'hats' as any })
    ).rejects.toThrow()
  })

  // Missing required field userId causes a ValidationError
  it('rejects a missing userId', async () => {
    const { userId: _u, ...rest } = VALID_ITEM
    await expect(ClothingItem.create(rest)).rejects.toThrow()
  })

  // Missing required field name causes a ValidationError
  it('rejects a missing name', async () => {
    const { name: _n, ...rest } = VALID_ITEM
    await expect(ClothingItem.create(rest)).rejects.toThrow()
  })

  // Missing required field imageUrl causes a ValidationError
  it('rejects a missing imageUrl', async () => {
    const { imageUrl: _i, ...rest } = VALID_ITEM
    await expect(ClothingItem.create(rest)).rejects.toThrow()
  })

  // Missing required field category causes a ValidationError
  it('rejects a missing category', async () => {
    const { category: _c, ...rest } = VALID_ITEM
    await expect(ClothingItem.create(rest)).rejects.toThrow()
  })
})
