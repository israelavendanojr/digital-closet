const createOutfit = async (req:any, res:any) => {
    const newOutfit = req.body;
    res.json({ message: 'Outfit created.', outfit: newOutfit})
}
//get outfit 
const getOutfit = async (req:any, res:any) => {
    res.json({message: `Returning outfit with id ${req.params.id}.`})
}
//get all outfits from a user
const getAllOutfits = async (req:any, res:any) => {
    res.json({message: `Retrieving all outfits for user id ${req.params.id}.`})
}
const updateOutfit = async (req:any, res:any) => {
    res.json({message: `Updating outfit with id ${req.params.id}.`})
}
const deleteOutfit = async (req:any, res:any) => {
    res.json({message: `Deleting outfit with id ${req.params.id}.`})
}

export {createOutfit, getOutfit, getAllOutfits, updateOutfit, deleteOutfit};
