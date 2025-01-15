import { Request, Response } from "express";
import User from "../user/user.schema";
import nodemailer from "nodemailer";
import Admin from "./admin.schema";
import jwt from "jsonwebtoken";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    await User.create({
      email,
      password: "",
      onboardingStatus: "pending",
      kycStatus: "pending",
    });

    console.log(`User created with email: ${email}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not set in environment variables.");
      res
        .status(500)
        .json({ message: "Email service is not configured properly." });
      return;
    }

    const invitationUrl = `http://localhost:5000/api/set-password?email=${email}`;

    // Send invitation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Invitation to join",
      text: `Click the link to set your password: ${invitationUrl}`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Invitation email sent to: ${email}`);
    console.log(`Invitation url is `, invitationUrl);

    res.status(201).json({ message: "User created and invitation sent" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

// Block or unblock user
export const toggleUserBlock = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res
      .status(200)
      .json({ message: !user.isBlocked ? "User blocked" : "User unblocked" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    // 1. Find the admin by email
    const admin = await Admin.findOne({ email });
    console.log(email + " " + password);
    if (!admin) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (password != admin.password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET as string, // Ensure your JWT secret is set in the environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // 4. Save the token to the admin (optional, if you want to store it in the database)
    admin.accessToken = token;
    await admin.save();

    // 5. Send the JWT token in the response
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Function to get user analytics (e.g., user count by date range)
export async function getUserAnalytics(req: Request, res: Response) {
  const { startDate, endDate } = req.query; // Expecting date range query parameters

  try {
    // Parse dates
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Get the count of users created in the date range
    const userCount = await User.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    res.status(200).json({ userCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user analytics" });
  }
}
// Function to get users with pending onboarding or KYC
export async function getPendingUsers(req: Request, res: Response) {
  try {
    const pendingOnboarding = await User.find({ onboardingStatus: "pending" });
    const pendingKYC = await User.find({ kycStatus: "pending" });

    res.status(200).json({
      pendingOnboarding: pendingOnboarding.length,
      pendingKYC: pendingKYC.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pending users" });
  }
}
