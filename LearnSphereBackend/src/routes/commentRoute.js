import express from "express";
import {
  addComment,
  getCommentsByCourse,
  addReply,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/add", addComment);
commentRouter.post("/get-by-course", getCommentsByCourse);
commentRouter.post("/add-reply", addReply);

export default commentRouter;
