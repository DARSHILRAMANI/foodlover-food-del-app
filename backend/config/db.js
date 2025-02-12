import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://darshilramani:8141888296@cluster0.mfoat.mongodb.net/food-app"
    )
    .then(() => console.log("DB Connected"));
};
