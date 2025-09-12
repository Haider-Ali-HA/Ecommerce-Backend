import User from "../models/users.modal.js";
import {
  forgotPassword as forgotPasswordShared,
  resetPassword as resetPasswordShared,
} from "./password.controller.js";

// Manager Controllers for Admin

export const createManager = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // generate 6-digit verification token
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const newUser = new User({
      name,
      email,
      password,
      role,
      phone,
      verifyToken,
      verifyTokenExpires,
    });
    await newUser.save();

    // Do NOT generate a token here; keep the admin logged in
    res.status(201).json({
      message: "Manager created successfully",
      user: newUser,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating manager", error, success: false });
  }
};

export const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" }).select("-password");
    res.status(200).json({ managers, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching managers", error, success: false });
  }
};

export const updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const updatedManager = await User.findByIdAndUpdate(
      id,
      { name, email, password, phone },
      { new: true }
    );

    if (!updatedManager) {
      return res
        .status(404)
        .json({ message: "Manager not found", success: false });
    }

    res.status(200).json({
      message: "Manager updated successfully",
      user: updatedManager,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating manager", error, success: false });
  }
};

export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedManager = await User.findByIdAndDelete(id);
    if (!deletedManager) {
      return res
        .status(404)
        .json({ message: "Manager not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Manager deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting manager", error, success: false });
  }
};

export const getManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const manager = await User.findById(id).select("-password");
    if (!manager) {
      return res
        .status(404)
        .json({ message: "Manager not found", success: false });
    }
    res.status(200).json({
      message: "Manager fetched successfully",
      user: manager,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching manager", error, success: false });
  }
};

// Staff Controllers for Admin

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // generate 6-digit verification token
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const newUser = new User({
      name,
      email,
      password,
      role,
      phone,
      verifyToken,
      verifyTokenExpires,
    });
    await newUser.save();

    // Do NOT generate a token here; keep the admin logged in
    res.status(201).json({
      message: "Staff created successfully",
      user: newUser,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating staff", error, success: false });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");
    res.status(200).json({ staff, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching staff", error, success: false });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const updatedStaff = await User.findByIdAndUpdate(
      id,
      { name, email, password, phone },
      { new: true }
    );

    if (!updatedStaff) {
      return res
        .status(404)
        .json({ message: "Staff not found", success: false });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      user: updatedStaff,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating staff", error, success: false });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaff = await User.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res
        .status(404)
        .json({ message: "Staff not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Staff deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting staff", error, success: false });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findById(id).select("-password");
    if (!staff) {
      return res
        .status(404)
        .json({ message: "Staff not found", success: false });
    }
    res.status(200).json({
      message: "Staff fetched successfully",
      user: staff,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching staff", error, success: false });
  }
};

// Reuse shared password functions for admin flows
export const forgotPassword = forgotPasswordShared;
export const resetPassword = resetPasswordShared;

// Verify New User

export const verifyNewUser = async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token) {
      return res
        .status(400)
        .json({ message: "User ID and token are required", success: false });
    }
    const user = await User.findOne({
      _id: userId,
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User is already verified", success: false });
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ message: "User verified successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying user", error, success: false });
  }
};
