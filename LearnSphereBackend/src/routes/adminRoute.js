import express from "express";
import { adminLogin, approveCourse, pendingCourses, pendingTeachers, rejectCourse } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/pending-courses", pendingCourses);
adminRouter.get("/pending-teachers", pendingTeachers);
adminRouter.post("/approve-course", approveCourse)
adminRouter.post("/reject-course", rejectCourse);

export default adminRouter;
