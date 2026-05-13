const createUser = async (req:any, res:any) => {
    const newUser = req.body;
    res.json({ message: 'User created.', user: newUser})
}
const getUser = async (req:any, res:any) => {
    res.json({message: `Returning user id ${req.params.id}.`})
}
const updateUser = async (req:any, res:any) => {
    res.json({message: `Updating user id ${req.params.id}.`})
}
const deleteUser = async (req:any, res:any) => {
    res.json({message: `Deleting user id ${req.params.id}.`})
}

export {createUser, getUser, updateUser, deleteUser};
