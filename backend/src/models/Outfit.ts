import mongoose, { Schema, Document } from 'mongoose';

export interface ICanvasLayoutEntry {
  clothingId: string;
  x: number;
  y: number;
  width: number;
  zIndex: number;
  rotation?: number;
}

export interface IOutfit extends Document {
  userId: string;
  name: string;
  items: mongoose.Types.ObjectId[];
  tags: string[];
  isFavorite: boolean;
  canvasLayout?: ICanvasLayoutEntry[];
  createdAt: Date;
}

const OutfitSchema = new Schema<IOutfit>({
  userId: { type: String, required: true },
  name:   { type: String, required: true },
  items:  [{ type: Schema.Types.ObjectId, ref: 'ClothingItem' }],
  tags:   [{ type: String }],
  isFavorite: { type: Boolean, default: false },
  canvasLayout: [{
    clothingId: { type: String, required: true },
    x:          { type: Number, required: true },
    y:          { type: Number, required: true },
    width:      { type: Number, required: true },
    zIndex:     { type: Number, required: true },
    rotation:   { type: Number, default: 0 },
  }],
}, { timestamps: true });

export default mongoose.model<IOutfit>('Outfit', OutfitSchema);