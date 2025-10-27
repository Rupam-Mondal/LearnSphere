import express from "express";
import {
  getAllCourse,
  getCourseDetails,
  enrollCourse,
  getInfo,
  GetUserRegisteredCourse,
  getTeacherName,
} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/feed",getAllCourse);
studentRouter.post("/course-details", getCourseDetails);
studentRouter.post("/enroll-course", enrollCourse);
studentRouter.post("/get-info", getInfo);
studentRouter.post('/my-courses', GetUserRegisteredCourse);
studentRouter.post('/get-teacher-name', getTeacherName);

export default studentRouter;