import express from "express";
import getResponse from "../controllers/aiSuggestion.js";

const router = express.Router();

router.get("/request", getResponse);

export default router;
