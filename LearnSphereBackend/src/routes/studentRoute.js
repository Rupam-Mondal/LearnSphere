import express from "express";
import {
  getAllCourse,
  getCourseDetails,
  enrollCourse,
  getInfo,
  GetUserRegisteredCourse,
  getTeacherName,
  markAsDone,
  checkForProgress,
  sendFeedback,
} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/feed",getAllCourse);
studentRouter.post("/course-details", getCourseDetails);
studentRouter.post("/enroll-course", enrollCourse);
studentRouter.post("/get-info", getInfo);
studentRouter.post('/my-courses', GetUserRegisteredCourse);
studentRouter.post('/get-teacher-name', getTeacherName);
studentRouter.post("/mark-as-done", markAsDone);
studentRouter.post("/check-progress", checkForProgress);
studentRouter.post("/send-feedback", sendFeedback);

export default studentRouter;