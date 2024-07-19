import User from "../models/user-model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

import { Request, Response, NextFunction } from "express";

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

export async function register(req: Request, res: Response) {
  console.log("Register endpoint hit");

  try {
    const { password, ...restOfUser } = req.body;

    const hashedPassword = await bcrypt.hash(password, 1); // Hash password with 10 salt rounds
    const user = new User({
      password: hashedPassword,
      ...restOfUser,
    }); // Create new user object

    await user.save(); // Save user to database

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error("Error during user registration:", error);

    if (error.code === 11000) {
      return res.status(400).json({ error: "User already exists" });
    }

    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
}



export async function logIn(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Log input details
    console.log("Login attempt for username:", username);

    const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Log the hashed password stored in the database
    console.log("Stored hashed password:", user.password);
    console.log("Entered password:", password);

    const isPasswordMatch = await user.comparePassword(password);
    console.log("Password match result:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Generate JWT token containing user id
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send token in response to the client, not the user object!
    res.status(200).json({ token });
  } catch (error: any) {
    console.log("Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
}

