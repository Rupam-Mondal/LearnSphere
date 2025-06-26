import express from "express";
import {
  getAllCourse,
  getCourseDetails,
} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/feed",getAllCourse);
studentRouter.post("/course-details", getCourseDetails);

export default studentRouter;