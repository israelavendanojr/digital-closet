import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'

const { default: userRouter } = await import('../../routes/userRoutes.js')

const app = express()
app.use(express.json())
app.use('/api/users', userRouter)

const BASE = '/api/users'

describe('User routes', () => {
  // Status 200 with "User created." message and the request body echoed under user
  it('POST / creates a user and echoes the body', async () => {
    const res = await request(app).post(BASE).send({ name: 'Alice', email: 'alice@example.com' })
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('User created.')
    expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@example.com' })
  })

  // Status 200 with a message that includes the requested user id
  it('GET /:id returns the user id in the message', async () => {
    const res = await request(app).get(`${BASE}/user_42`)
    expect(res.status).toBe(200)
    expect(res.body.message).toContain('user_42')
  })

  // Status 200 with a message that includes the targeted user id
  it('PUT /:id returns the user id in the message', async () => {
    const res = await request(app).put(`${BASE}/user_42`).send({ name: 'Bob' })
    expect(res.status).toBe(200)
    expect(res.body.message).toContain('user_42')
  })

  // Status 200 with a message that includes the targeted user id
  it('DELETE /:id returns the user id in the message', async () => {
    const res = await request(app).delete(`${BASE}/user_42`)
    expect(res.status).toBe(200)
    expect(res.body.message).toContain('user_42')
  })
})
