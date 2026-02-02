import { generateText } from "../models/aiModel.js";
import Course from "../models/courseModel.js";

import { GoogleGenAI } from "@google/genai";
import { checkAnswer, generateQuiz } from "../models/quizAiModel.js";
import User from "../models/userModel.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

function buildGeminiPrompt(userPrompt, courses) {
  const courseList =
    courses.length > 0
      ? courses
          .map(
            (c, i) =>
              `${i + 1}. ${c.title} - ${process.env.FRONTEND_URL}/student/course-details/${c._id}`,
          )
          .join("\n")
      : "No courses available.";

  return `
You are a friendly assistant for an education website.

User message:
"${userPrompt}"

Below is the COMPLETE list of courses available on our platform:
${courseList}

STRICT OUTPUT RULES (VERY IMPORTANT):
- If the user is NOT asking about learning or courses, reply normally like a human
- If the user wants to learn something:
    - Recommend ONLY from the list above
    - Include ONLY ONE link per course
    - Output links as PLAIN TEXT (no brackets, no markdown, no parentheses)
    - DO NOT repeat the link
    - DO NOT wrap links in [ ], ( ), or markdown
- If no relevant course exists, reply politely that the course is not available
- Keep the response short, clean, and human-like

EXAMPLE GOOD OUTPUT:
"You can check out our Java Programming course here:
http://localhost:5173/student/course-details/123"

EXAMPLE BAD OUTPUT (DO NOT DO THIS):
"[http://localhost:5173/student/course-details/123]"
"(http://localhost:5173/student/course-details/123)"
"http://localhost:5173/student/course-details/123 http://localhost:5173/student/course-details/123"
`;
}

export default async function getResponse(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: "failed",
      error: "Prompt is required",
    });
  }

  try {
    // 1️⃣ Fetch ALL approved courses
    const courses = await Course.find({ status: "APPROVED" }).select(
      "_id title topic",
    );

    // 2️⃣ Build Gemini prompt with full course list
    const geminiPrompt = buildGeminiPrompt(prompt, courses);

    // 3️⃣ Call Gemini
    const response = await generateText(geminiPrompt);

    // 4️⃣ Send response
    return res.status(200).json({
      success: "success",
      suggetion: response,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({
      success: "failed",
      error: "Internal Server Error",
    });
  }
}

export const interviewController = async (req, res) => {
  try {
    const { topic, messages } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Interview topic is required",
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required",
      });
    }

    // Convert chat history into readable conversation
    const conversation = messages
      .map((m) =>
        m.role === "user"
          ? `Candidate: ${m.content}`
          : `Interviewer: ${m.content}`,
      )
      .join("\n");

    const prompt = `
You are a professional technical interviewer.

Interview topic: ${topic}

STRICT RULES (must follow):
- This is an INTERVIEW, not a teaching session
- NEVER explain concepts or correct answers
- NEVER give detailed feedback during the interview
- Keep responses SHORT (2–3 lines max)
- Ask EXACTLY ONE question per response

Interview flow rules:
- Start with basic questions, then medium, then advanced
- After each candidate answer:
  - Give a very brief acknowledgment (e.g. "Okay", "Got it", "Thanks for explaining")
  - Immediately ask the next question
- If the answer is unclear or incorrect:
  - Ask ONE clarifying question only
- Do NOT restate the candidate’s answer
- Do NOT summarize concepts

Time rules:
- Total interview duration is ~5 minutes
- When approximately 1 minute remains:
  - Briefly inform the candidate
  - Ask ONE final wrap-up question

Conversation so far:
${conversation}

Now continue the interview.
Respond like a real interviewer.
Ask the next question only.
`;

    const response = await ai.models.generateContent({
      model: "gemma-3n-e4b-it", // ✅ FREE + instruction tuned
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.error("❌ Gemini Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Interview AI failed",
    });
  }
};

export const interviewResultController = async (req, res) => {
  try {
    const { topic, messages } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const conversation = messages
      .map((m) =>
        m.role === "user"
          ? `Candidate: ${m.content}`
          : `Interviewer: ${m.content}`,
      )
      .join("\n");

    const prompt = `
You are a strict technical interviewer.

Interview topic: ${topic}

Evaluate ONLY the candidate answers.

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.

JSON format:
{
  "score": number (0-10),
  "level": "Beginner" | "Intermediate" | "Advanced",
  "strengths": [string, string, string],
  "weaknesses": [string, string],
  "recommendation": string
}

Conversation:
${conversation}
`;

    const response = await ai.models.generateContent({
      model: "gemma-3n-e4b-it",
      contents: prompt,
    });

    let text = response.text.trim();

    // 🔥 SAFETY: remove code fences if present
    if (text.startsWith("```")) {
      text = text.replace(/```json|```/g, "").trim();
    }

    const parsed = JSON.parse(text);

    return res.json(parsed);
  } catch (error) {
    console.error("❌ Result generation error:", error.message);
    return res.status(500).json({
      error: "Result generation failed",
    });
  }
};

export const quizController = async (req, res) => {
  try {
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Quiz topic is required",
      });
    }

    const response = await generateQuiz(topic);
    // console.log("Raw Quiz Response:", response);
    const lines = response
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const quiz = [];
    let currentQuestion = null;

    for (const line of lines) {
      if (line.startsWith("[")) {
        if (currentQuestion) {
          try {
            quiz.push({
              question: currentQuestion,
              options: JSON.parse(line),
            });
            currentQuestion = null;
          } catch (err) {
            console.error("Invalid JSON options:", line);
          }
        }
      } else {
        currentQuestion = line;
      }
    }

    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("❌ Quiz API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid quiz format generated",
    });
  }
};

export const answerCheckController = async (req, res) => {
  try {
    const { questionList, userAnswersList } = req.body;
    if (!questionList || !userAnswersList) {
      return res.status(400).json({
        success: false,
        message: "Question and selected option are required",
      });
    }
    const response = await checkAnswer(questionList, userAnswersList);
    const cleanedResponse = response.match(/\{[\s\S]*\}/)[0];
    const result = JSON.parse(cleanedResponse);
    return res.status(200).json({
      success: true,
      questionList,
      userAnswersList,
      score: (result.totalScore / questionList.length) * 100,
      result: result,
    });
  } catch (error) {
    console.error("❌ Answer Check API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Answer check failed",
    });
  }
};

export const updateAttemptsController = async (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({
      success: false,
      message: "User ID and Course ID are required",
    });
  }

  try {
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const courseEntry = student.courses.find(
      (c) => c._id.toString() === courseId,
    );

    if (!courseEntry) {
      return res.status(404).json({
        success: false,
        message: "Course not found for this student",
      });
    }

    if (courseEntry.attempts === undefined) {
      courseEntry.attempts = 0;
    }

    if(courseEntry.isValidforCertificate){
      return res.status(400).json({
        success: false,
        message: "Course already completed. No further attempts allowed.",
      });
    }

    if(courseEntry.attempts >= 3){
      return res.status(400).json({
        success: false,
        message: "Maximum number of attempts reached.",
      });
    }

    courseEntry.attempts += 1;
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Attempts updated",
      attempts: courseEntry.attempts,
    });
  } catch (error) {
    console.error("❌ Update Attempts Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateMarksController = async (req, res) => {
  const { userId, courseId, marks } = req.body;
  if (!userId || !courseId || marks === undefined) {
    return res.status(400).json({
      success: false,
      message: "User ID, Course ID, and marks are required",
    });
  }

  try {
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const courseEntry = student.courses.find(
      (c) => c._id.toString() === courseId,
    );

    if (!courseEntry) {
      return res.status(404).json({
        success: false,
        message: "Course not found for this student",
      });
    }


    courseEntry.percentageGained = marks;
    if(marks >= 70){
      courseEntry.dateOfCompletion = new Date();
      courseEntry.isValidforCertificate = true;
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Marks updated",
      marks: courseEntry.marks,
    });
  } catch (error) {
    console.error("❌ Update Marks Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
