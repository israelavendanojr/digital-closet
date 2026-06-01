import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'
import Outfit from '../../models/Outfit.js'

const VALID_OUTFIT = {
  userId: 'user_123',
  name: 'Summer Look',
}

describe('Outfit model', () => {
  // A document with userId and name is persisted and returns a Mongoose _id
  it('saves a valid outfit', async () => {
    const outfit = await Outfit.create(VALID_OUTFIT)
    expect(outfit._id).toBeDefined()
    expect(outfit.name).toBe('Summer Look')
    expect(outfit.userId).toBe('user_123')
  })

  // Mongoose timestamps option automatically sets createdAt as a Date
  it('adds createdAt timestamp automatically', async () => {
    const outfit = await Outfit.create(VALID_OUTFIT)
    expect(outfit.createdAt).toBeInstanceOf(Date)
  })

  // isFavorite defaults to false per the schema definition
  it('defaults isFavorite to false', async () => {
    const outfit = await Outfit.create(VALID_OUTFIT)
    expect(outfit.isFavorite).toBe(false)
  })

  // Providing isFavorite: true persists the value correctly
  it('saves isFavorite as true when provided', async () => {
    const outfit = await Outfit.create({ ...VALID_OUTFIT, isFavorite: true })
    expect(outfit.isFavorite).toBe(true)
  })

  // When no items are provided, the schema defaults to an empty array
  it('defaults items to an empty array', async () => {
    const outfit = await Outfit.create(VALID_OUTFIT)
    expect(outfit.items).toEqual([])
  })

  // When no tags are provided, the schema defaults to an empty array
  it('defaults tags to an empty array', async () => {
    const outfit = await Outfit.create(VALID_OUTFIT)
    expect(outfit.tags).toEqual([])
  })

  // ObjectId references in items are stored and retrievable as strings
  it('saves item ObjectIds', async () => {
    const id = new mongoose.Types.ObjectId()
    const outfit = await Outfit.create({ ...VALID_OUTFIT, items: [id] })
    expect(outfit.items[0]?.toString()).toBe(id.toString())
  })

  // Tags array is stored exactly as provided
  it('saves tags', async () => {
    const outfit = await Outfit.create({ ...VALID_OUTFIT, tags: ['summer', 'casual'] })
    expect(outfit.tags).toEqual(['summer', 'casual'])
  })

  // Missing required field userId causes a ValidationError
  it('rejects a missing userId', async () => {
    await expect(Outfit.create({ name: 'Test' })).rejects.toThrow()
  })

  // Missing required field name causes a ValidationError
  it('rejects a missing name', async () => {
    await expect(Outfit.create({ userId: 'user_123' })).rejects.toThrow()
  })
})
