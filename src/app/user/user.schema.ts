import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  isBlocked: boolean;
  is2FAEnabled: boolean;
  onboardingStatus: string; // "pending", "completed"
  kycStatus: string; // "pending", "completed"
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isBlocked: { type: Boolean, default: false },
    is2FAEnabled: { type: Boolean, default: false },
    onboardingStatus: { type: String, default: "pending" },
    kycStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
