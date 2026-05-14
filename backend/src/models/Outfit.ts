import mongoose, { Schema, Document } from 'mongoose';

/*
 * Define the IOutfit interface that extends (inherit's everything from) Mongoose's Document.
 * - Mongoose document: a JavaScript object that represents a single record (row) in a MongoDB collection
 * - Collection: a group of MongoDB documents, similar to a table in relational databases
 */
export interface IOutfit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  items: mongoose.Types.ObjectId[];
  tags: string[];
  createdAt: Date;
}

/*
 * Define the OutfitSchema using Mongoose's Schema class, which describes the structure of the documents in the "Outfit" collection.
 */
const OutfitSchema = new Schema<IOutfit>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, required: true },
  items:  [{ type: Schema.Types.ObjectId, ref: 'ClothingItem' }],
  tags:   [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IOutfit>('Outfit', OutfitSchema);