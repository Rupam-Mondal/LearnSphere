import express from "express";
import getResponse, { interviewController, interviewResultController, quizController } from "../controllers/aiSuggestion.js";

const airouter = express.Router();

airouter.post("/request", getResponse);
airouter.post("/interview", interviewController);
airouter.get("/quiz", quizController);
airouter.post("/result", interviewResultController);
export default airouter;
