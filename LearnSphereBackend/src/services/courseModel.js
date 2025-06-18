import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
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
      title: {
        type: String,
        required: true,
      },
      content: {
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
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
