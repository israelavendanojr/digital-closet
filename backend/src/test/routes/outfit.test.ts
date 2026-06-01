import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'

vi.mock('@clerk/express', () => ({
  requireAuth: () => (_req: any, _res: any, next: any) => next(),
  clerkMiddleware: () => (_req: any, _res: any, next: any) => next(),
}))

const { default: outfitRouter } = await import('../../routes/outfitRoutes.js')

const app = express()
app.use(express.json())
app.use('/api/outfits', outfitRouter)

const USER_ID = 'user_test'
const BASE = '/api/outfits'

describe('Outfit routes', () => {
  describe('POST /', () => {
    // Status 201 with the new outfit body containing userId and name
    it('creates an outfit and returns 201', async () => {
      const res = await request(app).post(BASE).send({ userId: USER_ID, name: 'Summer Look' })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Summer Look')
      expect(res.body.userId).toBe(USER_ID)
    })

    // isFavorite is false when not included in the request body
    it('defaults isFavorite to false', async () => {
      const res = await request(app).post(BASE).send({ userId: USER_ID, name: 'Daily Fit' })
      expect(res.body.isFavorite).toBe(false)
    })

    // isFavorite: true in the request body is saved and returned
    it('saves isFavorite as true when provided', async () => {
      const res = await request(app).post(BASE).send({ userId: USER_ID, name: 'Fav Fit', isFavorite: true })
      expect(res.status).toBe(201)
      expect(res.body.isFavorite).toBe(true)
    })

    // Tags array is stored and returned as-is
    it('saves tags when provided', async () => {
      const res = await request(app).post(BASE).send({ userId: USER_ID, name: 'Tagged Fit', tags: ['casual', 'summer'] })
      expect(res.status).toBe(201)
      expect(res.body.tags).toEqual(['casual', 'summer'])
    })

    // items defaults to an empty array when omitted from the request body
    it('defaults items to empty array', async () => {
      const res = await request(app).post(BASE).send({ userId: USER_ID, name: 'Empty Fit' })
      expect(res.body.items).toEqual([])
    })
  })

  describe('GET /user/:userId', () => {
    // Status 200 with an array containing every outfit belonging to that user
    it('returns all outfits for a user', async () => {
      await request(app).post(BASE).send({ userId: USER_ID, name: 'Fit 1' })
      await request(app).post(BASE).send({ userId: USER_ID, name: 'Fit 2' })
      const res = await request(app).get(`${BASE}/user/${USER_ID}`)
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
    })

    // Status 200 with an empty array when no outfits exist for the given userId
    it('returns an empty array when the user has no outfits', async () => {
      const res = await request(app).get(`${BASE}/user/no-such-user`)
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('GET /:id', () => {
    // Status 200 with the full outfit document matching the requested id
    it('returns an outfit by id', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Beach Fit' })
      const res = await request(app).get(`${BASE}/${created.body._id}`)
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Beach Fit')
    })

    // Status 404 with "Outfit not found." when the id doesn't match any document
    it('returns 404 for an id that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).get(`${BASE}/${fakeId}`)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Outfit not found.')
    })
  })

  describe('PUT /:id', () => {
    // Status 200 with the updated name reflected in the response body
    it('updates the name of an outfit', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Old Name' })
      const res = await request(app).put(`${BASE}/${created.body._id}`).send({ name: 'New Name' })
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('New Name')
    })

    // Status 200 with isFavorite: true after being updated from the default false
    it('toggles isFavorite', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Fav Test' })
      const res = await request(app).put(`${BASE}/${created.body._id}`).send({ isFavorite: true })
      expect(res.status).toBe(200)
      expect(res.body.isFavorite).toBe(true)
    })

    // Updated tags array is returned in the response body
    it('updates tags', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Tag Test' })
      const res = await request(app).put(`${BASE}/${created.body._id}`).send({ tags: ['winter', 'cozy'] })
      expect(res.status).toBe(200)
      expect(res.body.tags).toEqual(['winter', 'cozy'])
    })

    // Status 404 with "Outfit not found." when the id doesn't match any document
    it('returns 404 for an id that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).put(`${BASE}/${fakeId}`).send({ name: 'Ghost' })
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Outfit not found.')
    })
  })

  describe('DELETE /:id', () => {
    // Status 200 with the message "Outfit deleted successfully."
    it('deletes an outfit and returns a success message', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'To Delete' })
      const res = await request(app).delete(`${BASE}/${created.body._id}`)
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Outfit deleted successfully.')
    })

    // A subsequent GET for the same id returns 404 — the outfit is gone from the DB
    it('the outfit is no longer retrievable after deletion', async () => {
      const created = await request(app).post(BASE).send({ userId: USER_ID, name: 'Gone' })
      const id = created.body._id
      await request(app).delete(`${BASE}/${id}`)
      const res = await request(app).get(`${BASE}/${id}`)
      expect(res.status).toBe(404)
    })

    // Status 404 with "Outfit not found." when the id doesn't match any document
    it('returns 404 for an id that does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).delete(`${BASE}/${fakeId}`)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Outfit not found.')
    })
  })
})
