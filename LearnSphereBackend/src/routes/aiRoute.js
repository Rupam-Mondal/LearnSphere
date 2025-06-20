import express from "express";
import getResponse from "../controllers/aiSuggestion.js";

const airouter = express.Router();

airouter.post("/request", getResponse);

export default airouter;
