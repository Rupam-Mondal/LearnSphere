import express from "express";
import axios from "axios";
import { endSession } from "../../interviewMemory.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { sessionId } = req.body;
  const session = endSession(sessionId);

  const evaluationPrompt = [
    {
      role: "system",
      content: `
You are an interview evaluator.
Score the candidate from 0 to 10 based on:
- Technical accuracy
- Depth
- Clarity
- Confidence

Return JSON ONLY:
{
  "score": number,
  "feedback": "short feedback"
}
      `,
    },
    ...session.messages,
  ];

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      messages: evaluationPrompt,
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = JSON.parse(response.data.choices[0].message.content);

  res.json(result);
});

export default router;
