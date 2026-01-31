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
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
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
  assessmentType: {
    type: String,
    enum: ["quiz", "interview"],
    default: "quiz",
  },
  ratings: {
    type: [Number],
    default: [],
  }
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
