// models/Business.ts

import mongoose, { Schema, model, Document } from "mongoose";

interface IBusiness extends Document {
  name: string;
  description: string;
  location: string;
  stars: number;
  reviews: string[]; //id array
}
const businessSchema = new Schema<IBusiness>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String },
  stars: { type: Number, default: 0, required: true },

});
const Business = model<IBusiness>("Business", businessSchema);
export default Business;
