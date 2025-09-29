import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  googleId?: string;
  otp?: string | null;
  otpExpires?: Date | null;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: String,
  googleId: String,
  otp: String,
  otpExpires: Date,
});

export const User = mongoose.model<IUser>("User", UserSchema);
