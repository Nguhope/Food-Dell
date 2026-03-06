import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },  // This will store the image URL or file path
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

const FoodModel = mongoose.models.food || mongoose.model("Food", foodSchema);
export default FoodModel;
