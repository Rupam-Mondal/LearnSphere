import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/LearnSphere`);
    try {
      await mongoose.connection.db
        .collection("doubtsessions")
        .dropIndex("course_1_student_1_status_1");
    } catch (error) {
      if (!["IndexNotFound", "NamespaceNotFound"].includes(error.codeName)) {
        console.warn("Could not drop old doubt session unique index:", error.message);
      }
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export default connectDB;
