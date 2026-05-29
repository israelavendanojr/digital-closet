import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfit extends Document {
  userId: string;
  name: string;
  items: mongoose.Types.ObjectId[];
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
}

const OutfitSchema = new Schema<IOutfit>({
  userId: { type: String, required: true },
  name:   { type: String, required: true },
  items:  [{ type: Schema.Types.ObjectId, ref: 'ClothingItem' }],
  tags:   [{ type: String }],
  isFavorite: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IOutfit>('Outfit', OutfitSchema);