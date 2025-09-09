import jwt from "jsonwebtoken";
import User from "../models/users.modal.js";

/**
 * Base authentication middleware.
 * - Accepts JWT from cookie "token" or Authorization: Bearer header.
 * - Verifies token & ensures user exists and is verified.
 * - Attaches sanitized user document to req.user.
 * NOTE: Role-specific checks now live in separate files (adminMiddleware.js, vendorMiddleware.js).
 */
export const authMiddleware = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isVerified) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not verified" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
