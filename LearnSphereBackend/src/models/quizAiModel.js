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


export async function generateQuiz(topic) {
  const prompt = `
Generate EXACTLY 10 quiz questions on the topic "${topic}".

STRICT RULES (VERY IMPORTANT):
- Each question MUST have EXACTLY 4 options.
- Do NOT provide answers or explanations.
- Use simple language.
- Focus on core concepts.
- Avoid overly complex questions.
- Ensure variety in question types.
- keep difficulty easy to medium (max 2-3 slightly harder).
- Output ONLY plain text
- NO explanations
- NO introductions
- NO conclusions
- NO headings
- NO numbering
- NO markdown
- NO emojis
- NO extra sentences
- Assume the topic is being studied by a student preparing for an exam, mainly from programming world.

FORMAT (repeat EXACTLY 10 times):

Question text
["option1","option2","option3","option4"]

If you output ANYTHING else, the response is INVALID and unusable.
`;

  const response = await ai.models.generateContent({
    model: "gemma-3n-e4b-it",
    contents: prompt,
  });

  return response.text;
}

export async function checkAnswer(questionList, userAnswersList) {
  const prompt = `
You are a quiz answer evaluator.
You are given a list of questions with options and a list of user's answers.
Evaluate the user's answers and provide a score.
For each question, if the user's answer matches the correct option, award 1 point; otherwise, award 0 points.
Format the output as a JSON object with the total score and an array with format like ["correct", "incorrect", ...].
The question list is: ${JSON.stringify(questionList)}
The user's answers are: ${JSON.stringify(userAnswersList)}
Provide the output in the following JSON format:
{
  "totalScore": number,
  "results": ["correct" or "incorrect", ...]
  "correctAnswers": ["correct option1", "correct option2", ...]
}
- Do NOT include any explanations or additional text.
- Ensure the output is valid JSON.
`
  const response = await ai.models.generateContent({
    model: "gemma-3n-e4b-it",
    contents: prompt,
  });
  const text = response.text;
  return text;
}