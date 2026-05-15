import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;  // Actual hasing happens in userController.ts, this is just the field to store the hashed password
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },  // This will store the hashed password, not the plaintext password
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);