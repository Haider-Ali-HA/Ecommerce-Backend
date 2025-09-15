import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/users.modal.js"; // Adjust path if needed

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Generate random name
const randomName = () => {
  const firstNames = [
    "Haider", "Ali", "Usman", "Ahmed", "Zeeshan",
    "Hassan", "Bilal", "Asad", "Kashif", "Owais"
  ];
  const lastNames = [
    "Khan", "Malik", "Sheikh", "Rehman", "Iqbal",
    "Raza", "Shah", "Nawaz", "Akhtar", "Mughal"
  ];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

// Generate random email
const randomEmail = (index) => {
  const domains = ["gmail.com", "yahoo.com", "hotmail.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `manager${index}@${domain}`;
};

// Generate random Pakistani phone number
const randomPhone = () => {
  return "03" + Math.floor(100000000 + Math.random() * 900000000).toString();
};

// Seed managers function
const generateManagers = async () => {
  try {
    const managers = [];

    for (let i = 1; i <= 100; i++) {
      const hashedPassword = await bcrypt.hash("Password123!", 10); // Same default password for all

      managers.push({
        name: randomName(),
        email: randomEmail(i),
        password: hashedPassword,
        phone: randomPhone(),
        role: "manager",
        isVerified: true, // Mark as verified
      });
    }

    // Insert all managers at once
    await User.insertMany(managers);
    console.log("✅ 100 managers added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding managers:", error);
    process.exit(1);
  }
};

generateManagers();
