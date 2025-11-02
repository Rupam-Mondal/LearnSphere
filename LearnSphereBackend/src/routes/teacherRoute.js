import express from "express";
import {
  createCourse,
  getCourseInfo,
  getCourses,
  uploadLesson,
  deleteLesson,
} from "../controllers/teacherController.js";

const teacherRouter = express.Router(); 

teacherRouter.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Teacher Dashboard",
  });
});

teacherRouter.post("/create-course", createCourse);
teacherRouter.post("/get-courses", getCourses);
teacherRouter.post("/get-course-info", getCourseInfo);
teacherRouter.post("/upload-lesson", uploadLesson);
teacherRouter.post("/delete-lesson", deleteLesson);

export default teacherRouter;