
import ClothingItem from '../models/ClothingItem.js';
import { uploadToS3, deleteFromS3 } from '../lib/s3.js';
import { getAuth } from '@clerk/express';

const createClothing = async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }
        const { userId } = getAuth(req);
        const { name, category, tags } = req.body;
        const imageUrl = await uploadToS3(req.file.buffer, req.file.mimetype, req.file.originalname);
        const parsedTags = tags ? JSON.parse(tags) : [];
        const item = new ClothingItem({ userId, name, category, tags: parsedTags, imageUrl });
        await item.save();
        res.status(201).json(item);
    } catch (err: any) {
        console.error('createClothing error:', err);
        res.status(500).json({ message: err.message || 'Internal server error', code: err.Code || err.code });
    }
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
const updateClothes = async (req: any, res: any) => {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    const { name, category, tags } = req.body;

    if (req.file) {
        await deleteFromS3(item.imageUrl);
        item.imageUrl = await uploadToS3(req.file.buffer, req.file.mimetype, req.file.originalname);
    }

    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (tags !== undefined) item.tags = JSON.parse(tags);

    await item.save();
    res.json(item);
}
const deleteClothes = async (req: any, res: any) => {
    const item = await ClothingItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    await deleteFromS3(item.imageUrl);

    res.json({ message: 'Item deleted successfully.' });
}

export {createClothing, getClothingItem, getAllClothes, updateClothes, deleteClothes};
