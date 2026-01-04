import express from "express";
import axios from "axios";
import {
  initSession,
  getSession,
  addMessage,
} from "../../interviewMemory.js";

const router = express.Router();

router.post("/start", (req, res) => {
  const { sessionId, topic } = req.body;
  initSession(sessionId, topic);
  res.json({ message: "Interview started" });
});

router.post("/answer", async (req, res) => {
  const { sessionId, userAnswer } = req.body;
  const session = getSession(sessionId);

  addMessage(sessionId, { role: "user", content: userAnswer });

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      messages: session.messages,
      temperature: 0.6,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const aiQuestion = response.data.choices[0].message.content;

  addMessage(sessionId, { role: "assistant", content: aiQuestion });

  res.json({ question: aiQuestion });
});

export default router;
