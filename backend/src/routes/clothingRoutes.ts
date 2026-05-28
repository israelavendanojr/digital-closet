import express from 'express';
const clothingRouter = express.Router();
import { createClothing, getAllClothes,  getClothingItem, updateClothes, deleteClothes } from '../controllers/clothingController.js'
import upload from '../middleware/upload.js';

clothingRouter.post('/', upload.single('image'), createClothing);
clothingRouter.get('/user/:userId', getAllClothes);
clothingRouter.get('/:id', getClothingItem);
clothingRouter.put('/:id', updateClothes);
clothingRouter.delete('/:id', deleteClothes);

export default clothingRouter;
