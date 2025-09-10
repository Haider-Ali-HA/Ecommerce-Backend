import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema
// Roles supported: user (default), admin, vendor. Extend enum to add more roles.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "staff", "manager"],
      default: "staff",
    },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
const User = mongoose.model("User", userSchema);

export default User;
