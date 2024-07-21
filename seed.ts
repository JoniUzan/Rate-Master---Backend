// seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db";

import User from "./src/models/user-model";
import Business from "./src/models/business-model";
import Review, { IReview } from "./src/models/review-model";
import Like from "./src/models/like-model";

dotenv.config(); // Load environment variables

const users = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password456",
    firstName: "Jane",
    lastName: "Smith",
  },
  {
    username: "bob_johnson",
    email: "bob@example.com",
    password: "password789",
    firstName: "Bob",
    lastName: "Johnson",
  },
  {
    username: "alice_brown",
    email: "alice@example.com",
    password: "passwordabc",
    firstName: "Alice",
    lastName: "Brown",
  },
  {
    username: "charlie_davis",
    email: "charlie@example.com",
    password: "passworddef",
    firstName: "Charlie",
    lastName: "Davis",
  },
];

const businesses = [
  {
    name: "Tech Solutions Inc.",
    description: "IT consulting and services",
    location: "New York, NY",
  },
  {
    name: "Green Grocers",
    description: "Organic produce market",
    location: "San Francisco, CA",
  },
  {
    name: "Fitness First",
    description: "24/7 gym and fitness center",
    location: "Los Angeles, CA",
  },
  {
    name: "Bookworm's Paradise",
    description: "Independent bookstore",
    location: "Seattle, WA",
  },
  {
    name: "Gourmet Bites",
    description: "Fine dining restaurant",
    location: "Chicago, IL",
  },
  {
    name: "Auto Care Pro",
    description: "Car repair and maintenance",
    location: "Houston, TX",
  },
  { name: "Cozy Stays", description: "Boutique hotel", location: "Miami, FL" },
  {
    name: "Pet Pals",
    description: "Pet supplies and grooming",
    location: "Denver, CO",
  },
  {
    name: "Home Decor Haven",
    description: "Interior design and furniture",
    location: "Atlanta, GA",
  },
  {
    name: "Wellness Spa",
    description: "Relaxation and beauty treatments",
    location: "Boston, MA",
  },
];

async function seedDB() {
  try {
    console.log("Connecting to database...");
    await connectDB(); // Connect to the database
    console.log("Connected to database successfully.");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});
    await Like.deleteMany({});
    console.log("Existing data cleared.");

    // Create users
    console.log("Creating users...");
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users.`);

    // Create businesses
    console.log("Creating businesses...");
    const createdBusinesses = await Business.create(businesses);
    console.log(`Created ${createdBusinesses.length} businesses.`);

    // Create reviews and likes
    console.log("Creating reviews...");
    const reviews: IReview[] = [];
    for (let i = 0; i < 50; i++) {
      const user = createdUsers[i % 5]; // Rotate through users
      const business = createdBusinesses[i % 10]; // Rotate through businesses

      const review = new Review({
        content: `Review ${i + 1} for ${business.name}. Great experience!`,
        business: business._id,
        user: user._id,
      });

      await review.save();
      reviews.push(review);

      // Update user's reviews array
      await User.findByIdAndUpdate(user._id, {
        $push: { reviews: review._id },
      });

      // Update business's reviews array
      await Business.findByIdAndUpdate(business._id, {
        $push: { reviews: review._id },
      });
    }
    console.log(`Created ${reviews.length} reviews.`);

    // Create likes
    console.log("Creating likes...");
    let totalLikes = 0;
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const likesCount = (i % 5) + 1; // 1 to 5 likes per review

      for (let j = 0; j < likesCount; j++) {
        const user = createdUsers[(i + j) % 5]; // Ensure each user likes a review only once

        const like = new Like({
          review: review._id,
          user: user._id,
        });

        await like.save();

        // Update user's likes array
        await User.findByIdAndUpdate(user._id, {
          $push: { likes: like._id },
        });

        // Update review's likes count
        await Review.findByIdAndUpdate(review._id, { $inc: { likes: 1 } });

        totalLikes++;
      }
    }
    console.log(`Created ${totalLikes} likes.`);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("An error occurred while seeding the database:");
    console.error(err);
  } finally {
    console.log("Closing database connection...");
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

seedDB();
