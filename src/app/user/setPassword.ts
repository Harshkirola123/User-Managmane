import { Request, Response } from "express";
import User from "./user.schema";

export async function setPassword(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    // Find the user by email and update the password
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password },
      { new: true } // This will return the updated document
    );

    // If no user was found, send a 404 response
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Successfully updated password
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
}
