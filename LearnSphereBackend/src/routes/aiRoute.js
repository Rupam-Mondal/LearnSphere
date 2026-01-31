import express from "express";
import getResponse, { interviewController, quizController } from "../controllers/aiSuggestion.js";

const airouter = express.Router();

airouter.post("/request", getResponse);
airouter.post("/interview", interviewController);
airouter.get("/quiz", quizController);

export default airouter;
