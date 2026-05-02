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
  getDoubtSession,
  getDoubtSessionNotifications,
  requestDoubtSession,
} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/feed",getAllCourse);
studentRouter.post("/course-details", getCourseDetails);
studentRouter.post("/enroll-course", enrollCourse);
studentRouter.post("/get-info", getInfo);
studentRouter.get('/my-courses', GetUserRegisteredCourse);
studentRouter.post('/get-teacher-name', getTeacherName);
studentRouter.post("/mark-as-done", markAsDone);
studentRouter.post("/check-progress", checkForProgress);
studentRouter.post("/send-feedback", sendFeedback);
studentRouter.post("/doubt-session", getDoubtSession);
studentRouter.get("/doubt-session/notifications", getDoubtSessionNotifications);
studentRouter.post("/doubt-session/request", requestDoubtSession);

export default studentRouter;
