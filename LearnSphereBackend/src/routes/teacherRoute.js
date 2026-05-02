import express from "express";
import {
  GetAllTeachers,
  createCourse,
  getCourseInfo,
  getCourses,
  uploadLesson,
  deleteLesson,
  teacherRegistration,
  teacherLogin,
  getTeacherWithCourses,
  getDoubtSessionRequests,
  getDoubtSessionNotifications,
  sendDoubtSessionLink,
} from "../controllers/teacherController.js";

const teacherRouter = express.Router(); 

teacherRouter.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Teacher Dashboard",
  });
});

teacherRouter.post("/auth/register", teacherRegistration);
teacherRouter.post("/auth/login", teacherLogin);
teacherRouter.post("/create-course", createCourse);
teacherRouter.post("/get-courses", getCourses);
teacherRouter.post("/get-course-info", getCourseInfo);
teacherRouter.post("/upload-lesson", uploadLesson);
teacherRouter.post("/delete-lesson", deleteLesson);
teacherRouter.post("/doubt-session/requests", getDoubtSessionRequests);
teacherRouter.post("/doubt-session/notifications", getDoubtSessionNotifications);
teacherRouter.post("/doubt-session/send-link", sendDoubtSessionLink);
teacherRouter.get("/all_teachers", GetAllTeachers);
teacherRouter.get("/:teacherId/details", getTeacherWithCourses);

export default teacherRouter;
