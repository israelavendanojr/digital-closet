import express from 'express';
const app = express();
import userRouter from './routes/userRoutes.js'

app.use(express.json());
app.use('/api/users', userRouter);

app.post("/post", (req, res) => {
    console.log("Connected to frontend.");
    res.redirect("/");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
