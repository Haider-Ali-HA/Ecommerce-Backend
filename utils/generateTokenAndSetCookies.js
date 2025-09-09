// generate user token and store in a cookies

import jwt from "jsonwebtoken";
export const generateToken = (res, userId) => {
  if (!userId) {
    throw new Error("User ID is required to generate a token");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Helps prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // Cookie valid for 1 day
  });
};
