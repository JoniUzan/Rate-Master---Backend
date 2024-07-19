import { Request, Response } from 'express';
import Business from '../models/business-model'; // Adjust the path as needed
import Review from '../models/review-model'; // Adjust the path as needed

export async function getAllBusinesses(req: Request, res: Response) {
    try {
        const businesses = await Business.find();
        res.json(businesses);
    } catch (error) {
        console.error('Error fetching businesses, business.controller:', error);
        if (error instanceof Error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: 'Validation error', error: error.message });
            } else {
                res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
            }
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export async function getBusinessById(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }
        res.json(business);
    } catch (error) {
        console.log('Error fetching business, business.controller:', error);
        if (error instanceof Error) {
            if (error.name === 'CastError') {
                res.status(400).json({ message: 'Invalid ID', error: error.message });
            } else {
                res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
            }
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export async function getBusinessReviews(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const reviews = await Review.find({ business: id }).populate('user', "username");
        // populate : replase the user field inside the business object to the user DOCUMENT from the USERS collection
        res.json(reviews);
    } catch (error) {
        console.log('Error fetching reviews, business.controller:', error);
        if (error instanceof Error) {
            if (error.name === 'CastError') {
                res.status(400).json({ message: 'Invalid ID', error: error.message });
            } else {
                res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
            }
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

interface CustomRequest extends Request {
    userId?: string;
}

export async function addReview(req: CustomRequest, res: Response) {
    const userId = req.userId;
    const { id } = req.params;
    try {
        const { content } = req.body;
        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }
        const newReview = new Review({
            content,
            business: id,
            user: userId
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.log('Error adding review, business.controller:', error);
        if (error instanceof Error) {
            if (error.name === 'CastError') {
                res.status(400).json({ message: 'Invalid ID', error: error.message });
            } else {
                res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
            }
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};