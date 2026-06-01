import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { beforeAll, afterAll, afterEach } from 'vitest'
// pre-register all models so populate() works across every test file
import '../models/ClothingItem.js'
import '../models/Outfit.js'
import '../models/User.js'

let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
}, 300000)

afterEach(async () => {
  for (const collection of Object.values(mongoose.connection.collections)) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})
