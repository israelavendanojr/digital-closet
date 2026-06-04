import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'

vi.mock('@clerk/express', () => ({
  requireAuth: () => (_req: any, _res: any, next: any) => next(),
  clerkMiddleware: () => (_req: any, _res: any, next: any) => next(),
  getAuth: (_req: any) => ({ userId: 'user_test' }),
}))

// Hoisted flag so the upload mock can be toggled per test
const { injectFile } = vi.hoisted(() => ({ injectFile: { value: false } }))

vi.mock('../../middleware/upload.js', () => ({
  default: {
    single: () => (req: any, _res: any, next: any) => {
      if (injectFile.value) {
        req.file = { buffer: Buffer.from('fake-image'), mimetype: 'image/jpeg', originalname: 'test.jpg' }
      }
      next()
    },
  },
}))

vi.mock('../../lib/s3.js', () => ({
  uploadToS3: vi.fn().mockResolvedValue('/uploads/test.jpg'),
  deleteFromS3: vi.fn().mockResolvedValue(undefined),
}))

const mockAnalyzeClothingImage = vi.fn()
vi.mock('../../lib/gemini.js', () => ({
  analyzeClothingImage: mockAnalyzeClothingImage,
}))

const { default: clothingRouter } = await import('../../routes/clothingRoutes.js')

const app = express()
app.use(express.json())
app.use('/api/clothes', clothingRouter)

const ANALYZE = '/api/clothes/analyze'

beforeEach(() => {
  injectFile.value = false
  mockAnalyzeClothingImage.mockReset()
})

describe('POST /analyze', () => {
  // No file in the request → controller returns 400 before calling Gemini
  it('returns 400 when no image is provided', async () => {
    const res = await request(app).post(ANALYZE)
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Image file is required.')
  })

  // File present and Gemini returns an analysis → 200 with the analysis object
  it('returns the analysis result on success', async () => {
    injectFile.value = true
    const analysis = { name: 'Blue Jeans', category: 'bottoms', tags: ['casual', 'denim'] }
    mockAnalyzeClothingImage.mockResolvedValue(analysis)

    const res = await request(app).post(ANALYZE)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(analysis)
  })

  // Gemini throws → controller catches and returns 500
  it('returns 500 when analyzeClothingImage throws', async () => {
    injectFile.value = true
    mockAnalyzeClothingImage.mockRejectedValue(new Error('Gemini API error'))

    const res = await request(app).post(ANALYZE)
    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Gemini API error')
  })
})
