import mongoose from "mongoose";

const stockAdjustmentSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  reason: { type: String },
  adjustedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const StockAdjustment = mongoose.model("StockAdjustment", stockAdjustmentSchema);
export default StockAdjustment;
