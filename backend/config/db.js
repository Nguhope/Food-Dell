import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://nguhope96:674407835@cluster1.mkl6e.mongodb.net/food-del"
    )
    .then(() => console.log("DB conneted"));
};
