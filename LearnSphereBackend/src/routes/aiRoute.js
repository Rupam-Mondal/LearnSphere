import express from "express";
import getResponse, { answerCheckController, interviewController, quizController,interviewResultController, updateAttempts } from "../controllers/ai.js";

const airouter = express.Router();

airouter.post("/request", getResponse);
airouter.post("/interview", interviewController);
airouter.get("/quiz", quizController);
airouter.post("/result", interviewResultController);
airouter.post("/quiz/check", answerCheckController);
airouter.post("/quiz/updateAttempts", updateAttempts);

export default airouter;
