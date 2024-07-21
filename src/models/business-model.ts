// models/Business.ts

import mongoose, { Schema, model, Document } from "mongoose";
import { IReview } from "./review-model";

interface IBusiness extends Document {
  name: string;
  description: string;
  loction: string;
  stars: number;
  reviews: string[]; //id array
}
const businessSchema = new Schema<IBusiness>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  loction: { type: String },
  stars: { type: Number, default: 0, required: true },
  reviews: { type: [String], default: [] },
});
const Business = model<IBusiness>("Business", businessSchema);
export default Business;
