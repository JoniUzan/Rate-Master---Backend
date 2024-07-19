// seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db";
import { faker } from "@faker-js/faker";

import User from "./src/models/user-model";
import Business from "./src/models/business-model";
import Review from "./src/models/review-model";
import Like from "./src/models/like-model";

dotenv.config(); // Load environment variables

const hardCodedUsers = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password456",
  },
  {
    username: "bob_johnson",
    email: "bob@example.com",
    password: "password789",
  },
  {
    username: "alice_brown",
    email: "alice@example.com",
    password: "passwordabc",
  },
  {
    username: "charlie_davis",
    email: "charlie@example.com",
    password: "passworddef",
  },
];

const createBusinesses = (count: number) => {
  return Array(count)
    .fill(null)
    .map(() => ({
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
    }));
};

const createReviews = (count: number) => {
  return Array(count)
    .fill(null)
    .map(() => ({
      content: faker.lorem.paragraph(),
      likes: faker.number.int({ min: 0, max: 100 }),
    }));
};

async function seedDB() {
  try {
    await connectDB(); // Connect to the database

    // Clear existing data
    await User.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});
    await Like.deleteMany({});

    // Create users
    const createdUsers = await User.insertMany(hardCodedUsers);

    // Create businesses
    const businesses = createBusinesses(10);
    const createdBusinesses = await Business.insertMany(businesses);

    // Create reviews
    const reviews = createReviews(50);
    const createdReviews = await Promise.all(
      reviews.map(async (r) => {
        const review = new Review({
          ...r,
          business: faker.helpers.arrayElement(createdBusinesses)._id,
          user: faker.helpers.arrayElement(createdUsers)._id,
        });
        await review.save();
        return review;
      })
    );

    // Create likes (1-5 likes per review)
    await Promise.all(
      createdReviews.flatMap((review) => {
        const likeCount = faker.number.int({ min: 1, max: 5 });
        return Array(likeCount)
          .fill(null)
          .map(async () => {
            const like = new Like({
              review: review._id,
              user: faker.helpers.arrayElement(createdUsers)._id,
            });
            await like.save();
            return like;
          });
      })
    );

    console.log("Database seeded");
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdBusinesses.length} businesses`);
    console.log(`Created ${createdReviews.length} reviews`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close(); // Close the database connection
  }
}

seedDB();
