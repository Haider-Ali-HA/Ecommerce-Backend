import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  createManager,
  getAllManagers,
  getManagerById,
  updateManager,
  deleteManager,
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  verifyNewUser,
  forgotPassword,
  resetPassword,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Manager routes
router.post("/create-manager", authMiddleware, adminMiddleware, createManager);
router.get("/managers", authMiddleware, adminMiddleware, getAllManagers);
router.get("/managers/:id", authMiddleware, adminMiddleware, getManagerById);
router.put("/managers/:id", authMiddleware, adminMiddleware, updateManager);
router.delete("/managers/:id", authMiddleware, adminMiddleware, deleteManager);

// Staff routes
router.post("/create-staff", authMiddleware, adminMiddleware, createStaff);
router.get("/staff", authMiddleware, adminMiddleware, getAllStaff);
router.get("/staff/:id", authMiddleware, adminMiddleware, getStaffById);
router.put("/staff/:id", authMiddleware, adminMiddleware, updateStaff);
router.delete("/staff/:id", authMiddleware, adminMiddleware, deleteStaff);

// Admin utilities
router.post("/verify-new-user", authMiddleware, adminMiddleware, verifyNewUser);

// Admin-triggered password flows for users (protected)
router.post(
  "/users/forgot-password",
  authMiddleware,
  adminMiddleware,
  forgotPassword
);
router.post(
  "/users/reset-password",
  authMiddleware,
  adminMiddleware,
  resetPassword
);

export default router;
