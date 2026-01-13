import express from "express";
import getResponse, { interviewController } from "../controllers/aiSuggestion.js";

const airouter = express.Router();

airouter.post("/request", getResponse);
airouter.post("/interview", interviewController);

export default airouter;
