import { Request, Response } from "express";
import Business from "../models/business-model"; // Adjust the path as needed
import Review from "../models/review-model"; // Adjust the path as needed
import Like from "../models/like-model";
import User from "../models/user-model";

export async function getAllBusinesses(req: Request, res: Response) {
    try {
        const businesses = await Business.find();
        res.json(businesses);
    } catch (error) {
        console.error("Error fetching businesses, business.controller:", error);
        if (error instanceof Error) {
            if (error.name === "ValidationError") {
                res
                    .status(400)
                    .json({ message: "Validation error", error: error.message });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export async function getBusinessById(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        res.json(business);
    } catch (error) {
        console.log("Error fetching business, business.controller:", error);
        if (error instanceof Error) {
            if (error.name === "CastError") {
                res.status(400).json({ message: "Invalid ID", error: error.message });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export async function getBusinessReviews(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const reviews = await Review.find({ business: id }).populate(
            "user",
            "username"
        );
        // populate : replase the user field inside the business object to the user DOCUMENT from the USERS collection
        res.json(reviews);
    } catch (error) {
        console.log("Error fetching reviews, business.controller:", error);
        if (error instanceof Error) {
            if (error.name === "CastError") {
                res.status(400).json({ message: "Invalid ID", error: error.message });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export interface CustomRequest extends Request {
    userId?: string;
}

export async function addReview(req: CustomRequest, res: Response) {
    const userId = req.userId;
    const { id } = req.params;
    try {
        const { content } = req.body;
        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const newReview = new Review({
            content,
            business: id,
            user: userId,
        });
        await newReview.save();
        const user = await User.findById(userId);

        res.status(201).json(newReview);
    } catch (error) {
        console.log("Error adding review, business.controller:", error);
        if (error instanceof Error) {
            if (error.name === "CastError") {
                res.status(400).json({ message: "Invalid ID", error: error.message });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export async function editReview(req: CustomRequest, res: Response) {
    const userId = req.userId;
    const { id } = req.params;
    const newContent = req.body.content;

    try {
        const UpdatedReview = await Review.findOneAndUpdate(
            { _id: id, user: userId },
            { content: newContent },
            { new: true, runValidators: true }
        );
        if (!UpdatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json(UpdatedReview);
    } catch (error: any) {
        console.log("Error updating review, business.controller:", error);
        if (error) {
            if (error.name === "CastError") {
                res.status(400).json({ message: "Invalid ID", error: error.message });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export async function deleteReview(req: CustomRequest, res: Response) {
    const userId = req.userId;
    const { id } = req.params;

    try {
        const reviewToDelete = await Review.findOneAndDelete({
            _id: id,
            user: userId,
        });

        if (!reviewToDelete) {
            return res.status(404).json({
                message: "Review not found / You dont have access to this Review",
            });
        }

        res.status(200).json({ message: "Review Deleted Succssfully" });
    } catch (error: any) {
        console.log("Error deleting review, business.controller:", error);
        if (error) {
            if (error.name === "CastError") {
                res.status(400).json({ message: "Invalid ID", error: error.message });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export async function handleReviewLike(req: CustomRequest, res: Response) {
    const userId = req.userId;
    const { id } = req.params;

    try {
        const like = await Like.findOne({ review: id, user: userId });

        if (!like) {
            const newLike = new Like({
                review: id,
                user: userId,
            });
            await newLike.save();

            const updatedReview = await Review.findById(id);
            if (updatedReview) {
                updatedReview.likes += 1;
                await updatedReview.save();

                return res.status(200).json({ message: "Review liked successfully" });
            } else {
                return res.status(404).json({ message: "Review not found" });
            }
        } else {
            await Like.findOneAndDelete({ review: id, user: userId });

            const updatedReview = await Review.findById(id);
            if (updatedReview) {
                updatedReview.likes -= 1;
                await updatedReview.save();

                return res.status(200).json({ message: "Review unliked successfully" });
            }

            return res.status(200).json({ message: "Review Unliked" });
        }
    } catch (error: any) {
        console.error("Error liking/unliking review:", error);
        if (error.name === "CastError") {
            res.status(400).json({ message: "Invalid ID", error: error.message });
        } else {
            res.status(500).json({
                message: "An unexpected error occurred",
                error: error.message,
            });
        }
    }
}
