import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  reviews: string[];
  likes: string[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  reviews: { type: [String], required: true, default: [] },
  likes: { type: [String], required: true, default: [] },
});

const User = model<IUser>("User", userSchema);
export default User;
