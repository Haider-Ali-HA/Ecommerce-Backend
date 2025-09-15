import User from "../models/users.modal.js";
import {
  forgotPassword as forgotPasswordShared,
  resetPassword as resetPasswordShared,
} from "./password.controller.js";

// Manager Controllers for Admin

export const createManager = async (req, res) => {
  try {
    const { name, email, password, phone, isVerified } = req.body;

    if (!name || !email || !password || !phone || isVerified === "undefined") {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Only generate a verification token if the user isn't marked verified
    let verifyToken;
    let verifyTokenExpires;
    if (!isVerified) {
      verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
      verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "manager",
      phone,
      isVerified: Boolean(isVerified),
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
    // parse pagination query params
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    ); // cap limit to 100
    const skip = (page - 1) * limit;

    const filter = { role: "manager" };

    const [totalManagers, managers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 }) // descending order
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalManagers / limit));

    res.status(200).json({
      success: true,
      page,
      limit,
      totalManagers,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      managers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching managers", error, success: false });
  }
};

export const updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, isVerified } = req.body;
    console.log(req.body);

    // Basic required fields (isVerified is optional when updating)

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Load the user and apply changes, then save so "pre('save')" hooks (e.g. password hashing) run.
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Manager not found", success: false });
    }

    user.name = name;
    user.email = email;

    user.phone = phone;

    // Only update verification state when provided by client.
    if (typeof isVerified !== "undefined") {
      user.isVerified = Boolean(isVerified);
      if (user.isVerified) {
        // clear any pending verification token when admin marks user verified
        user.verifyToken = undefined;
        user.verifyTokenExpires = undefined;
      }
    }

    const updatedManager = await user.save();

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
