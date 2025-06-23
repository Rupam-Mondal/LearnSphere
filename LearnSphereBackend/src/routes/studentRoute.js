import express from "express";
import { getAllCourse } from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/feed",getAllCourse)

export default studentRouter;