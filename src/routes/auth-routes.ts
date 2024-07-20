import { Router } from "express";
import { register, logIn, getUserById, getAllUsers } from "../controllers/auth-controller";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", logIn);

// get user/users for development
authRoutes.get("/:id", getUserById);
authRoutes.get("/", getAllUsers);
