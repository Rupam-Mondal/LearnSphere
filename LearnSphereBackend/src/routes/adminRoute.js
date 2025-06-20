import express from "express";
import { adminLogin, pendingCourses } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/pending-courses", pendingCourses);

export default adminRouter;
