// import { Request, Response } from "express";
// import User from "../models/user-model";

export const getUsers = async (req: Request, res: Response) => {
  const { query } = req;
  try {
    const users = await User.find({ username: { $regex: query.username } });
    users[0].username;
    res.json({ message: "Get all users 12233r3dsf" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

// export const getUser = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     // getting user from the database
//     res.json({ message: `Get a user ${id}` });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({ error: err.message });
//   }
// };
