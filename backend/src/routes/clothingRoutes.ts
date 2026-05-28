import express from 'express';
const clothingRouter = express.Router();
import { createClothing, getAllClothes,  getClothingItem, updateClothes, deleteClothes } from '../controllers/clothingController.js'

clothingRouter.post('/', createClothing);
clothingRouter.get('/user/:userId', getAllClothes);
clothingRouter.get('/:id', getClothingItem);
clothingRouter.put('/:id', updateClothes);
clothingRouter.delete('/:id', deleteClothes);

export default clothingRouter;
