import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js'
import clothesRouter from './routes/clothingRoutes.js'
import outfitRouter from './routes/outfitRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/clothes', clothesRouter);
app.use('/api/outfits', outfitRouter);

app.post("/post", (req, res) => {
    console.log("Connected to frontend.");
    res.redirect("/");
});

const PORT = 8080;
const MONGO_URL = process.env.MONGO_URL as string;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');

    // Only start the server once DB connection succeeds.
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));