import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/LearnSphere`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export default connectDB;
