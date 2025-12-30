import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  topicCover:{
    type: [String],
    default: []
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1000,
  },
  thumbnail: {
    type: String,
    default:
      "https://instructor-academy.onlinecoursehost.com/content/images/2020/10/react-2.png",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lessons: [
    {
      videoId:{
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      videoUrl: {
        type: String,
      },
      resources: [
        {
          type: String,
        },
      ],
    },
  ],

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  demoVideo: {
    type: String,
    default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
