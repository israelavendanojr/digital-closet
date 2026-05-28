
import ClothingItem from '../models/ClothingItem.js';

const createClothing = async (req:any, res:any) => {
    const newClothes = req.body;
    res.json({ message: 'Clothes created.', clothes: newClothes})
}
//get clothing item by id
const getClothingItem = async (req:any, res:any) => {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
}
//get all clothes for a user
const getAllClothes = async (req:any, res:any) => {
    const items = await ClothingItem.find({ userId: req.params.userId });
    res.json(items);
}
const updateClothes = async (req:any, res:any) => {
    res.json({message: `Updating clothing with id ${req.params.id}.`})
}
const deleteClothes = async (req:any, res:any) => {
    res.json({message: `Deleting clothing with id ${req.params.id}.`})
}

export {createClothing, getClothingItem, getAllClothes, updateClothes, deleteClothes};
