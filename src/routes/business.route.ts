import { Router } from "express";
import { verifyToken } from "../middelware/auth-middelware";
import { getBusinessById, getBusinessReviews, getAllBusinesses, addReview } from "../controllers/business.controller";

export const businessRoute = Router();

// Public routes
businessRoute.get("/", getAllBusinesses);
businessRoute.get("/:id", getBusinessById);
businessRoute.get("/reviews/:id", getBusinessReviews);

// Protected route for adding reviews
businessRoute.post("/reviews/:id", verifyToken, addReview);


