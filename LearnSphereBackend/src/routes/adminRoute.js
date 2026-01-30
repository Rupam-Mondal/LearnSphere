import express from "express";
import { adminLogin, approveCourse, pendingCourses, pendingTeachers, rejectCourse, getTeacherDatails, updateTeacherStatus } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/pending-courses", pendingCourses);
adminRouter.get("/pending-teachers", pendingTeachers);
adminRouter.post("/approve-course", approveCourse)
adminRouter.post("/reject-course", rejectCourse);
adminRouter.get("/get-teacher-details", getTeacherDatails);
adminRouter.post("/update-teacher-status", updateTeacherStatus);

export default adminRouter;
