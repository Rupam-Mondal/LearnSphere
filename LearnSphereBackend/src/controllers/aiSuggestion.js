import { generateText } from "../services/aiModel.js";
import Course from "../services/courseModel.js";

function buildGeminiPrompt(userPrompt, courses) {
  const courseList =
    courses.length > 0
      ? courses
          .map(
            (c, i) =>
              `${i + 1}. ${c.title} - ${process.env.FRONTEND_URL}/student/course-details/${c._id}`
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
      "_id title topic"
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
