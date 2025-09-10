
export const managerMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Forbidden: Vendors only" });
  }

  next();
};
