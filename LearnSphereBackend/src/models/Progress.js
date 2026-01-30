import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedLessons: [
        {
            videoId:{
                type: String, //courseID+video{number}
                required: true,
            }
        }
    ]
} , { timestamps: true  });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;