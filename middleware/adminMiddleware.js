// middlewares/adminMiddleware.js
export const adminMiddleware = (req, res, next) => {
    console.log(req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next();
};
