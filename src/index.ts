import express, { Application } from "express";
import { authRoutes } from "./routes/auth-routes";
import { businessRoute } from "./routes/business.route";
import cors from "cors";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 3000;

const app: Application = express();

async function main() {
  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());
  // allow CORS for local development (for production, you should configure it properly)
  app.use(cors());

  // Routes

  app.use("/api/auth", authRoutes);
  app.use("/api/business", businessRoute);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
main();
