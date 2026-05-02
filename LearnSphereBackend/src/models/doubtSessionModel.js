import mongoose from "mongoose";

const doubtSessionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["REQUESTED", "LINK_SENT", "COMPLETED", "CANCELLED"],
      default: "REQUESTED",
    },
    roomId: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

doubtSessionSchema.index({ course: 1, student: 1, createdAt: -1 });
doubtSessionSchema.index({ course: 1, teacher: 1, status: 1, createdAt: -1 });

const DoubtSession = mongoose.model("DoubtSession", doubtSessionSchema);
export default DoubtSession;
