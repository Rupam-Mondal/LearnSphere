import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

export async function generateText(Prompt) {
  const response = await ai.models.generateContent({
    model: "gemma-3n-e4b-it",
    contents: Prompt,
    systemInstruction: `You first listen that whats the user's skill and user will explain that what he wants to learn and what he knows, then you will suggest him on what topic he should buy a course and what he should learn next. You will also suggest him the topic name only in one word. and it user asks another topic then you will just give the answer like "I am not meant to answer this question, I am just here to help you in your learning journey."`,
  });
  const text = response.text;
  return text;
}
