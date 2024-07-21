import { Schema, model, Types } from 'mongoose';

interface IReview {
  content: string;
  business: Types.ObjectId;
  user: Types.ObjectId;
  likes: number;
}

const reviewSchema = new Schema<IReview>({
  content: { type: String, required: true },
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
});

const Review = model<IReview>('Review', reviewSchema);
export default Review;
