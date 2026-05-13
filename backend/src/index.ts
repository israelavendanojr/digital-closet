import express from 'express';
const app = express();
import userRouter from './routes/userRoutes.js'
import clothesRouter from './routes/clothingRoutes.js'
import outfitRouter from './routes/outfitRoutes.js';

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/clothes', clothesRouter);
app.use('/api/outfits', outfitRouter);

app.post("/post", (req, res) => {
    console.log("Connected to frontend.");
    res.redirect("/");
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
