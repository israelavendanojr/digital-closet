
const createClothing = async (req:any, res:any) => {
    const newClothes = req.body;
    res.json({ message: 'Clothes created.', clothes: newClothes})
}
//get clothing item from a user
const getClothingItem = async (req:any, res:any) => {
    res.json({message: `Returning clothing with id ${req.params.id}.`})
}
//get all clothes from a user
const getAllClothes = async (req:any, res:any) => {
    res.json({message: `Retrieving clothes for user id ${req.params.id}.`})
}
const updateClothes = async (req:any, res:any) => {
    res.json({message: `Updating clothing with id ${req.params.id}.`})
}
const deleteClothes = async (req:any, res:any) => {
    res.json({message: `Deleting clothing with id ${req.params.id}.`})
}

export {createClothing, getClothingItem, getAllClothes, updateClothes, deleteClothes};
