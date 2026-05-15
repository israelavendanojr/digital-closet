import mongoose, { Schema, Document } from 'mongoose';

/*
 * Define the IClothingItem interface that inherit's everything from Mongoose's Document.
 * - Mongoose document: a JavaScript object that represents a single record (row) in a MongoDB collection
 * - Collection: a group of MongoDB documents, similar to a table in relational databases
 */
export interface IClothingItem extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'hatwear';
  tags: string[];
  imageUrl: string;
  createdAt: Date;
}

/*
 * Define the ClothingItemSchema using Mongoose's Schema class, which describes the structure of the documents in the "ClothingItem" collection.
 */
const ClothingItemSchema = new Schema<IClothingItem>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },
  category: { type: String, enum: ['tops','bottoms','outerwear','footwear','accessories','hatwear'], required: true },
  tags:     [{ type: String }],
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IClothingItem>('ClothingItem', ClothingItemSchema);