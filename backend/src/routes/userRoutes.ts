import express from 'express';
const userRouter = express.Router();
import { createUser, getUser,  updateUser, deleteUser } from '../controllers/userController.js'

userRouter.post('/', createUser);
userRouter.get('/:id', getUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
