import { generateText } from "../services/aiModel.js";

export default async function getResponse(req, res) {
  const { prompt } = req.body;
  if (!prompt) {
    return res
      .status(400)
      .json({ success: "failed", error: "Prompt is required" });
  }

  const newPrompt = `${prompt}. suggest me only the technology name in one word or comma seperated in a sigle line that i should learn to gain that mentioned skill. if it is not related to learning then just say "I am not meant to answer this question." exactly this answer nothing else.`;
  const response = await generateText(newPrompt);
  res.status(200).json({
    success: "success",
    message: "Text generated successfully",
    suggetion: response,
  });
}


