import express from 'express';
const outfitRouter = express.Router();
import { createOutfit, getOutfit, updateOutfit, deleteOutfit, getAllOutfits } from '../controllers/outfitController.js'

outfitRouter.post('/', createOutfit);
outfitRouter.get('/user/:userId', getAllOutfits);
outfitRouter.get('/:id', getOutfit);
outfitRouter.put('/:id', updateOutfit);
outfitRouter.delete('/:id', deleteOutfit);

export default outfitRouter;
