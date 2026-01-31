import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

export async function generateTextForQuiz(prompt) {
  const response = await ai.models.generateContent({
    model: "gemma-3n-e4b-it",
    contents: prompt,
    systemInstruction: `
You are a STRICT JSON API.

Your ONLY task:
- Read the topic provided by the user.
- Generate EXACTLY 15 quiz questions on that topic.
- Difficulty: easy to medium (at most 2-3 question slightly harder).

OUTPUT RULES (MANDATORY):
- Output ONLY valid JSON.
- Output MUST be a JSON array.
- Output MUST start with '[' and end with ']'.
- Do NOT include any text before or after the JSON.
- Do NOT include explanations, answers, notes, headings, markdown, or comments.
- Do NOT ask questions.
- Do NOT include instructions.
- Do NOT include answer keys.
- Do NOT include extra fields.
- Use DOUBLE QUOTES ONLY.
- No trailing commas.
- The output MUST be parsable using JSON.parse().

SCHEMA (EXACT):
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

If you cannot follow these rules, return an empty JSON array: []
`,
  });
  const text = response.text;
  console.log("Generated Quiz JSON:", text);
  return text;
}
