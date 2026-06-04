import Outfit from '../models/Outfit.js';

const createOutfit = async (req: any, res: any) => {
    const { userId, name, items, tags, isFavorite, canvasLayout } = req.body;
    const parsedItems = items ?? [];
    const parsedTags = tags ?? [];
    const outfit = new Outfit({ userId, name, items: parsedItems, tags: parsedTags, isFavorite: isFavorite ?? false, canvasLayout: canvasLayout ?? [] });
    await outfit.save();
    const populated = await outfit.populate('items');
    res.status(201).json(populated);
}

const getOutfit = async (req: any, res: any) => {
    const outfit = await Outfit.findById(req.params.id).populate('items');
    if (!outfit) return res.status(404).json({ message: 'Outfit not found.' });
    res.json(outfit);
}

const getAllOutfits = async (req: any, res: any) => {
    const outfits = await Outfit.find({ userId: req.params.userId }).populate('items');
    res.json(outfits);
}

const updateOutfit = async (req: any, res: any) => {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) return res.status(404).json({ message: 'Outfit not found.' });

    const { name, items, tags, isFavorite, canvasLayout } = req.body;
    if (name !== undefined) outfit.name = name;
    if (items !== undefined) outfit.items = items;
    if (tags !== undefined) outfit.tags = tags;
    if (isFavorite !== undefined) outfit.isFavorite = isFavorite;
    if (canvasLayout !== undefined) outfit.canvasLayout = canvasLayout;

    await outfit.save();
    const populated = await outfit.populate('items');
    res.json(populated);
}

const deleteOutfit = async (req: any, res: any) => {
    const outfit = await Outfit.findByIdAndDelete(req.params.id);
    if (!outfit) return res.status(404).json({ message: 'Outfit not found.' });
    res.json({ message: 'Outfit deleted successfully.' });
}

export {createOutfit, getOutfit, getAllOutfits, updateOutfit, deleteOutfit};
