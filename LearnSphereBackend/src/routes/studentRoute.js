import express from "express";
import {
  getAllCourse,
  getCourseDetails,
  enrollCourse,
} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/feed",getAllCourse);
studentRouter.post("/course-details", getCourseDetails);
studentRouter.post("/enroll-course", enrollCourse);

export default studentRouter;