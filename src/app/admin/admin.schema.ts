import mongoose, { Schema, Document } from "mongoose";

// Define the structure of the Admin document
interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER"; // You can have specific roles; here I defined ADMIN and USER
  accessToken: string;
}

// Define the Admin schema
const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER"],
      default: "ADMIN",
    },
    accessToken: { type: String, default: "" }, // Empty string by default
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Admin model
const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
