import express from "express";
import getResponse from "../controllers/aiSuggestion.js";

const airouter = express.Router();

airouter.get("/request", getResponse);

export default airouter;
