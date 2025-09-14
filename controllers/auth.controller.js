import User from "../models/users.modal.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateTokenAndSetCookies.js";
import sendEmail from "../utils/sendEmail.js";
import { verifyTokenEmail } from "../utils/emailTemplates/verifyTokenEmail.js";
import { resetPasswordEmail } from "../utils/emailTemplates/resetPasswordEmail.js";
import {
  forgotPassword as forgotPasswordShared,
  resetPassword as resetPasswordShared,
} from "./password.controller.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // check if all fields are provided
    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // generate 6-digit verification token
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      phone,
      verifyToken,
      verifyTokenExpires,
    });
    await newUser.save();

    // Send verification token to user's email (token only)
    await sendEmail({
      to: newUser.email,
      subject: "Verify your email",
      html: verifyTokenEmail({
        name: newUser.name,
        token: newUser.verifyToken,
      }),
    });

    // Generate token
    generateToken(res, newUser._id);
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      success: true,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { verifyToken } = req.body;
    console.log(verifyToken);

    // Verify verification token
    if (!verifyToken) {
      return res
        .status(400)
        .json({ message: "Verification token is required", success: false });
    }

    // Find user by verification token
    const user = await User.findOne({
      verifyToken,
      verifyTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }

    // check if user is already verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User is already verified", success: false });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verifyUser: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if all fields are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    // check user is verified
    if (!user.isVerified) {
      // generate 6-digit verification token
      const verifyToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      user.verifyToken = verifyToken;
      user.verifyTokenExpires = verifyTokenExpires;
      await user.save();

      // Send verification token to user's email (token only)
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Your verification code is ${verifyToken}`,
      });
      // Generate token
      generateToken(res, user._id);
      return res.status(400).json({
        message:
          "User is not verified, please check your email for the verification code",
        success: false,
        needsVerification: true,
      });
    }

    // Generate token
    generateToken(res, user._id);
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verifyUser: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const forgotPassword = forgotPasswordShared;
export const resetPassword = resetPasswordShared;

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully", success: true });
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user; // Set in authMiddleware
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
