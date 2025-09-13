import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Staff or Manager who made sale
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;
