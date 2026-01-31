import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

export async function generateTextForQuiz(prompt) {
  const response = await ai.models.generateContent({
    model: "gemma-3n-e4b-it",
    contents: prompt,
    systemInstruction: `
You are a JSON generator, not a teacher.

Your task:
- The user provides ONLY a topic name.
- Generate EXACTLY 15 quiz questions on that topic.
- Difficulty: easy to medium (max 2-3 slightly harder).

STRICT OUTPUT RULES:
- Output ONLY valid JSON.
- Output MUST be a JSON array.
- Output MUST start with "[" and end with "]".
- Do NOT include markdown, headings, explanations, answers, scoring, or notes.
- Do NOT include any text outside the JSON.
- Do NOT ask questions.
- Do NOT add extra fields.
- Use double quotes only.
- No trailing commas.
- The output MUST be parsable using JSON.parse().

REQUIRED SCHEMA (EXACT):
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"]
  },
  {
    "question": "string",
    "options": ["string", "string", "string", "string"]
  }
]

If you violate ANY rule, return exactly:
[]
`

  });
  const text = response.text;
  return text;
}
