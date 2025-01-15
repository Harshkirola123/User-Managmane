import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.schema";
import { sendPasswordResetEmail } from "./user.email";
import { uploadKYC } from "../utilis/mutleConfi";

// Create Password (via email)
export const createPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (password != user.password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    if (user.is2FAEnabled) {
      // If 2FA is enabled, prompt for 2FA code
      res.status(200).json({ message: "2FA required", needs2FA: true });
      return;
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ user: user, token: token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate a password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h", // Token expiration time (1 hour)
      }
    );

    // Send the reset password email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const uploadKYCPhoto = [
  uploadKYC.single("kycPhoto"), // Multer middleware for photo upload

  async (req: Request, res: Response) => {
    try {
      const { email } = req.body; // Assuming user is authenticated and userId is set

      // Check if file is uploaded
      if (!req.file) {
        res
          .status(400)
          .json({ message: "No photo uploaded. Please upload a valid photo." });
        return;
      }

      // Find user by ID
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update the user's KYC status and photo
      user.kycPhoto = `/uploads/kyc_photos/${req.file.filename}`; // Save the file path
      user.kycStatus = "complete"; // Set KYC status to 'complete'
      await user.save(); // Save updated user details

      res.status(200).json({
        message: "KYC photo uploaded successfully. KYC status is now complete.",
        kycStatus: user.kycStatus,
        kycPhoto: user.kycPhoto,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
