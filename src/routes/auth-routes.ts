import { Router } from "express";
import { register, logIn } from "../controllers/auth-controller";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", logIn);
    