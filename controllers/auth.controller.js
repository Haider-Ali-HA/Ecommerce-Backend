import User from "../models/users.modal.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateTokenAndSetCookies.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

       // generate 6-digit verification token
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    

    // Create new user
    const newUser = new User({ name, email, password, verifyToken, verifyTokenExpires });
    await newUser.save();

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
    return res.status(500).json({ message: "Internal server error" });
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
        .json({ message: "Verification token is required" });
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
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "User is not verified" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    generateToken(res, user._id);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = req.user; // Set in authMiddleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};