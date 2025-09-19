import express from "express";
import { register,login, verifyUser,getProfile, forgotPassword, resetPassword, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me", authMiddleware, getProfile); // protected route
// router.get("/me", adminMiddleware, getProfile); // protected route


export default router;

