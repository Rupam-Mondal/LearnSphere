import express from "express";
import getResponse, { answerCheckController, interviewController, quizController } from "../controllers/ai.js";

const airouter = express.Router();

airouter.post("/request", getResponse);
airouter.post("/interview", interviewController);
airouter.get("/quiz", quizController);
airouter.post("/quiz/check", answerCheckController);

export default airouter;
