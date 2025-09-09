import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser()); // <-- MUST run before your routes so req.cookies exists


// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

  app.get("/", (req, res) => {
    res.send("Welcome to the E-commerce API");
  });
app.use("/api/auth", authRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
