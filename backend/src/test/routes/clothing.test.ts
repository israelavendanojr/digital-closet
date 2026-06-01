import { describe, it, expect, vi, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'

vi.mock('@clerk/express', () => ({
  requireAuth: () => (_req: any, _res: any, next: any) => next(),
  clerkMiddleware: () => (_req: any, _res: any, next: any) => next(),
}))

vi.mock('../../middleware/upload.js', () => ({
  default: {
    single: () => (req: any, _res: any, next: any) => {
      req.file = { filename: 'test.jpg' }
      next()
    },
  },
}))

const { default: clothingRouter } = await import('../../routes/clothingRoutes.js')

const app = express()
app.use(express.json())
app.use('/api/clothes', clothingRouter)

const USER_ID = 'user_test'
const BASE = '/api/clothes'

beforeAll(() => {
  // suppress fs.unlink errors for non-existent test files
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Clothing routes', () => {
  describe('POST /', () => {
    // Status 201 with the new item body including the mocked imageUrl
    it('creates a clothing item and returns 201', async () => {
      const res = await request(app).post(BASE).send({
        userId: USER_ID,
        name: 'Red Hoodie',
        category: 'tops',
      })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Red Hoodie')
      expect(res.body.category).toBe('tops')
      expect(res.body.imageUrl).toBe('/uploads/test.jpg')
    })

    // Tags JSON string is parsed and stored as an array on the document
    it('saves tags when provided', async () => {
      const res = await request(app).post(BASE).send({
        userId: USER_ID,
        name: 'Denim Jacket',
        category: 'outerwear',
        tags: JSON.stringify(['casual', 'denim']),
      })
      expect(res.status).toBe(201)
      expect(res.body.tags).toEqual(['casual', 'denim'])
    })
  })

  describe('GET /user/:userId', () => {
    // Status 200 with an array containing every item belonging to that user
    it('returns all items for a user', async () => {
      await request(app).post(BASE).send({ userId: USER_ID, name: 'Item 1', category: 'tops' })
      await request(app).post(BASE).send({ userId: USER_ID, name: 'Item 2', category: 'bottoms' })
      const res = await request(app).get(`${BASE}/user/${USER_ID}`)
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
    })

    // Status 200 with an empty array when no items exist for the given userId
    it('returns an empty array when the user has no items', async () => {
      const res = await request(app).get(`${BASE}/user/no-such-user`)
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('GET /:id', () => {
    // Status 200 with the full item document matching the requested id
    it('returns a clothing item by id', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Jeans', category: 'bottoms' })
      const res = await request(app).get(`${BASE}/${created.body._id}`)
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Jeans')
    })

    // Status 404 with "Item not found." when the id doesn't match any document
    it('returns 404 for an id that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).get(`${BASE}/${fakeId}`)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Item not found.')
    })
  })

  describe('PUT /:id', () => {
    // Status 200 with the updated name reflected in the response body
    it('updates the name of a clothing item', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Jacket', category: 'outerwear' })
      const res = await request(app).put(`${BASE}/${created.body._id}`).send({ name: 'Winter Jacket' })
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Winter Jacket')
    })

    // Tags JSON string is parsed and the updated array is returned
    it('updates tags', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Tee', category: 'tops' })
      const res = await request(app)
        .put(`${BASE}/${created.body._id}`)
        .send({ tags: JSON.stringify(['summer', 'light']) })
      expect(res.status).toBe(200)
      expect(res.body.tags).toEqual(['summer', 'light'])
    })

    // Status 404 with "Item not found." when the id doesn't match any document
    it('returns 404 for an id that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).put(`${BASE}/${fakeId}`).send({ name: 'Ghost' })
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Item not found.')
    })
  })

  describe('DELETE /:id', () => {
    // Status 200 with the message "Item deleted successfully."
    it('deletes a clothing item and returns a success message', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Sneakers', category: 'footwear' })
      const res = await request(app).delete(`${BASE}/${created.body._id}`)
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Item deleted successfully.')
    })

    // A subsequent GET for the same id returns 404 — the item is gone from the DB
    it('the item is no longer retrievable after deletion', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Hat', category: 'hatwear' })
      const id = created.body._id
      await request(app).delete(`${BASE}/${id}`)
      const res = await request(app).get(`${BASE}/${id}`)
      expect(res.status).toBe(404)
    })

    // Status 404 with "Item not found." when the id doesn't match any document
    it('returns 404 for an id that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).delete(`${BASE}/${fakeId}`)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Item not found.')
    })
  })
})
