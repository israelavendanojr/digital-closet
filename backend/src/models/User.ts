import mongoose, { Schema, Document } from 'mongoose';

/*
 * Define the IUser interface that extends (inherit's everything from) Mongoose's Document.
 * - Mongoose document: a JavaScript object that represents a single record (row) in a MongoDB collection
 * - Collection: a group of MongoDB documents, similar to a table in relational databases
 */
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;  // Actual hasing happens in userController.ts, this is just the field to store the hashed password
    createdAt: Date;
}

/*
 * Define the UserSchema using Mongoose's Schema class, which describes the structure of the documents in the "users" collection.
 */
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },  // This will store the hashed password, not the plaintext password
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);